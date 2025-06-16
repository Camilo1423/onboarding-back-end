/**
 * Configuración del entorno de la aplicación
 *
 * @property {Object} jwt - Configuraciones de autenticación JWT
 * @property {string} jwt.secret - Clave secreta para firmar tokens de acceso
 * @property {string} jwt.accessTokenExpiresIn - Tiempo de expiración del token de acceso (por defecto: '15m')
 * @property {string} jwt.refreshTokenSecret - Clave secreta para firmar tokens de actualización
 * @property {string} jwt.refreshTokenExpiresIn - Tiempo de expiración del token de actualización (por defecto: '7d')
 *
 * @property {Object} bcrypt - Configuraciones para el hash de contraseñas
 * @property {number} bcrypt.saltRounds - Número de rondas de salt para el hash (por defecto: 10)
 *
 * @property {Object} smtp - Configuraciones del servidor SMTP para envío de correos
 * @property {string} smtp.host - Host del servidor SMTP (por defecto: 'smtp.gmail.com')
 * @property {number} smtp.port - Puerto del servidor SMTP (por defecto: 587)
 * @property {string} smtp.user - Usuario para autenticación SMTP
 * @property {string} smtp.pass - Contraseña para autenticación SMTP
 * @property {boolean} smtp.secure - Usar conexión segura (por defecto: false)
 *
 * @property {Object} meeting - Configuraciones de la reunión de Google Meet
 * @property {string} meeting.url - URL de la reunión de Google Meet (por defecto: 'https://meet.google.com/xxx-xxxx-xxx')
 * @property {string} meeting.key_encript - Clave para encriptar la URL de la reunión de Google Meet (por defecto: 'key_encript')
 *
 * Variables de Entorno Requeridas:
 *
 * JWT:
 * - JWT_SECRET_ACCESS: Clave secreta para firmar tokens de acceso
 * - JWT_ACCESS_TOKEN_EXPIRES_IN: Tiempo de expiración del token de acceso (ej: '15m', '1h', '1d')
 * - JWT_SECRET_REFRESH: Clave secreta para firmar tokens de actualización
 * - JWT_REFRESH_TOKEN_EXPIRES_IN: Tiempo de expiración del token de actualización (ej: '7d', '30d')
 *
 * BCRYPT:
 * - BCRYPT_SALT_ROUNDS: Número de rondas de salt para el hash de contraseñas
 *
 * SMTP:
 * - SMTP_HOST: Host del servidor SMTP
 * - SMTP_PORT: Puerto del servidor SMTP
 * - SMTP_USER: Usuario para autenticación SMTP
 * - SMTP_PASS: Contraseña para autenticación SMTP
 * - SMTP_SECURE: Usar conexión segura (true/false)
 *
 * MEETING:
 * - MEETING_URL: URL de la reunión de Google Meet (por defecto: 'https://meet.google.com/xxx-xxxx-xxx')
 * - KEY_ENCRIPT: Clave para encriptar la URL de la reunión de Google Meet (por defecto: 'key_encript')
 */
export const envConfig = {
  jwt: {
    secret: process.env.JWT_SECRET_ACCESS || 'secret',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenSecret: process.env.JWT_SECRET_REFRESH || 'secret',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-password',
    secure: process.env.SMTP_SECURE === 'true',
  },
  meeting: {
    url: process.env.MEETING_URL || 'https://meet.google.com/xxx-xxxx-xxx',
    key_encript: process.env.KEY_ENCRIPT || 'key_encript',
  },
};
