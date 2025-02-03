import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { URL } from "url";

export async function GET() {
  try {
    // Parse the Railway MySQL URL
    const dbUrl = new URL(
      "mysql://root:ftfAmchHgjrCtDhNtjmdWFwaZSFWDfvo@roundhouse.proxy.rlwy.net:39231/railway"
    );

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: dbUrl.hostname,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.substr(1),
      port: dbUrl.port || 3306,
    });

    // Query to get patients with their latest consultation
    const [patients] = await connection.execute(`
      SELECT 
        p.*,
        c.consultation_date as last_consultation,
        c.symptoms,
        c.doctor_summary,
        COALESCE(cons.consultation_count, 0) as consultation_count
      FROM patients p
      LEFT JOIN (
        SELECT 
          patient_id,
          consultation_date,
          symptoms,
          doctor_summary,
          ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY consultation_date DESC) as rn
        FROM consultations
      ) c ON p.id = c.patient_id AND c.rn = 1
      LEFT JOIN (
        SELECT patient_id, COUNT(*) as consultation_count
        FROM consultations
        GROUP BY patient_id
      ) cons ON p.id = cons.patient_id
      ORDER BY CASE 
        WHEN c.consultation_date IS NULL THEN 1 
        ELSE 0 
      END, c.consultation_date DESC
    `);

    // Get detailed consultation history for each patient
    const [consultations] = await connection.execute(`
      SELECT 
        patient_id,
        consultation_date,
        symptoms,
        symptoms_duration,
        patient_summary,
        doctor_summary
      FROM consultations
      ORDER BY consultation_date DESC
    `);

    // Group consultations by patient
    const consultationsByPatient = consultations.reduce((acc, consultation) => {
      if (!acc[consultation.patient_id]) {
        acc[consultation.patient_id] = [];
      }
      acc[consultation.patient_id].push(consultation);
      return acc;
    }, {});

    // Combine patient data with their consultations
    const enrichedPatients = patients.map((patient) => ({
      ...patient,
      consultations: consultationsByPatient[patient.id] || [],
    }));

    await connection.end();

    return NextResponse.json(enrichedPatients);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
