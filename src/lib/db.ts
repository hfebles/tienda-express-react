
import mysql from 'mysql2/promise';

// Creamos un pool de conexiones para manejar múltiples conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para ejecutar consultas
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error);
    throw error;
  }
}

// Función para verificar la conexión con la base de datos
export async function testConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    console.log('Conexión a MySQL establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error al conectar con MySQL:', error);
    return false;
  }
}

