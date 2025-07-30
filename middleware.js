import { NextResponse } from 'next/server';
import { sanitizeInput, validateInput } from './sanitize';

export async function middleware(req) {

  const { pathname } = req.nextUrl;
  const lang = req.headers.get("accept-language")?.split(',')[0];// Detectar el idioma del navegador
  console.log("lang", lang)

  // Ignorar acceso al ZIP
  if (pathname === '/schema-util.zip' || pathname === '/schemas_examples.zip' || pathname === '/api/auth/session' || pathname.startsWith("/api/auth/callback")) {
    return; // permitir sin restricción
  }

  const pagesRoutes = [
    "/",
    "/appGraphQL",
    "/appModule",
    "/appSoap",
    "/appWebSocket",
    "/datasourceMySql",
    "/datasourceOra",
    "/datasourcePostgres",
    "/datasourceSqlServer",
    "/dependencies",
    "/devops",
    "/events",
    "/file",
    "/grpc",
    "/job",
    "/queue",
    "/sftp",
    "/pendingFiles",
    "/credits",
    "/plans",
    "/socket.io",
  ];

  let mensaje = lang.startsWith("es")
    ? `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Página no encontrada</title>
          <link rel="stylesheet" href="/404.css">
        </head>
        <body>
          <h1>404 - Página no encontrada</h1>
          <p>La página que intentas acceder no existe o no está disponible.</p>
          <p>Por favor, utiliza los enlaces del menú para navegar de manera segura por el sitio.</p>
          <p><a href="/">Haz clic aquí para regresar a la página principal</a></p>
        </body>
        </html>
      `
    : `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Page Not Found</title>
          <link rel="stylesheet" href="/404.css">
        </head>
        <body>
          <h1>404 - Page Not Found</h1>
          <p>The page you are trying to access does not exist or is unavailable.</p>
          <p>Please use the navigation menu links to safely browse the site.</p>
          <p><a href="/">Click here to return to the homepage</a></p>
        </body>
        </html>
      `;

  const url = req.nextUrl.clone();
  const isRefresh = req.headers.get("sec-fetch-mode") === "navigate";
  const referrer = req.headers.get("referer") || ""; // Referer header
  const isSameDomain = referrer.includes(req.nextUrl.origin); // Validar si proviene del mismo dominio

  const isNotRoot = url.pathname !== "/";

  console.log("midleware pathname", url.pathname)
  if (pathname === '/api/auth/error') {
    const error = req.nextUrl.searchParams.get('error');
    console.error("Error en la autenticación:", error);
    if (error === 'SESSION_DUPLICADA') {
      mensaje = lang.startsWith("es")
        ? `
        <!DOCTYPE html>
       <html lang="es">
       	<head>
       	 <meta charset="UTF-8">
       	 <meta name="viewport" content="width=device-width, initial-scale=1.0">
       	 <title>Sesión duplicada detectada</title>
       	 <link rel="stylesheet" href="/404.css">
       </head>
       	<body>
         <h1>🔒 Sesión activa detectada</h1>
         <p>Tu cuenta ya tiene una sesión iniciada en otro dispositivo.</p>
         <p>Por seguridad, solo se permite una sesión activa por usuario.</p>
         <p>Para continuar, cierra la sesión anterior desde ese dispositivo.</p> 
         <p>Si no tienes acceso, puedes esperar a que expire automáticamente.</p>
         <p><a href="/">Haz clic aquí para regresar al inicio de sesión</a></p>
       	</body>
       </html>

      `
        : `
       <!DOCTYPE html>
         <html lang="en">
         	<head>
         		<meta charset="UTF-8">
         		<meta name="viewport" content="width=device-width, initial-scale=1.0">
         		<title>Duplicate Session Detected</title>
         		<link rel="stylesheet" href="/404.css">
             </head>
          <body>
              <h1>🔒 Active Session Detected</h1>
              <p>Your account already has an active session on another device.</p>
              <p>For security reasons, only one active session is allowed per user.</p>
              <p>To continue, please sign out from the other device.</p>
              <p>If you no longer have access, you may wait for the session to expire automatically.</p>
              <p><a href="/">Click here to return to the login page</a></p>
          </body>
         </html>
      `;
    }
    else {
      mensaje = lang.startsWith("es")
        ? `
         <!DOCTYPE html>
         <html lang="es">
         <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Error de autenticación</title>
           <link rel="stylesheet" href="/404.css">
         </head>
         <body>
           <h1>⚠️ Error de inicio de sesión</h1>
           <p>No se pudo completar la autenticación correctamente.</p>
           <p>Esto puede deberse a un token inválido, sesión expirada, cancelación desde el proveedor o problemas de red.</p>
           <p>Por favor, intenta iniciar sesión nuevamente o verifica tus credenciales.</p>
           <p><a href="/">Haz clic aquí para volver a la página de inicio de sesión</a></p>
         </body>
         </html>
      `
        : `
       <!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Authentication Error</title>
         <link rel="stylesheet" href="/404.css">
       </head>
       <body>
         <h1>⚠️ Login Error</h1>
         <p>We couldn’t complete your authentication successfully.</p>
         <p>This may be due to an invalid token, an expired session, a provider-side cancellation, or a network issue.</p>
         <p>Please try signing in again or check your credentials.</p>
         <p><a href="/">Click here to return to the login page</a></p>
       </body>
       </html>
      `;
    }
  }
  if (isRefresh && isNotRoot && !isSameDomain) {
    console.log("----------------  Redirect  Refresh to 404 page ----------------------------")
    const response = new Response(mensaje,
      {
        status: 404,
        headers: { "Content-Type": "text/html" },
      }
    );

    return response;

  }

  if (
    !pagesRoutes.includes(url.pathname) &&
    !url.pathname.startsWith("/api/datasource") &&
    !url.pathname.startsWith("/api/resources") &&
    !url.pathname.startsWith("/api/quote") &&
    !url.pathname.startsWith("/api/socket") &&
    !url.pathname.startsWith("/api/auth") &&
    !url.pathname.match(/^\/(workbox-.*\.js|sw\.js|.*\.(png|jpg|jpeg|svg|webp|gif|ico|json|css))$/)
  ) {
    console.log("------------------------------  Redirect No Page definition to 404 page ---------------------------------------------")
    const response = new Response(mensaje,
      {
        status: 404,
        headers: { "Content-Type": "text/html" },
      }
    );

    return response;

  }

  // Sanitización del cuerpo de la solicitud
  if (req.body) {
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    }
  }

  // Sanitización de nombres de archivos
  if (req.files) {
    for (const file of req.files) {
      file.originalname = sanitizeInput(file.originalname);
    }
  }
  // Validación de parámetros en la URL
  req.nextUrl.searchParams.forEach((value, key) => {
    if (validateInput(value)) {
      console.log("------------  Parámetro inválido status: 400 ---------- ", value)
      return new Response("Parámetro inválido", { status: 400 });
    }
  });

  return NextResponse.next();
}

// Configuración del middleware para rutas específicas
export const config = {
  matcher: [
    "/:path*", "/api/:path*", "/appGraphQL/:path*", "/appModule/:path*", "/appSoap/:path*",
    "/appWebSocket/:path*", "/datasourceMySql/:path*", "/datasourceOra/:path*",
    "/datasourcePostgres/:path*", "/datasourceSqlServer/:path*", "/dependencies/:path*", "/devops/:path*",
    "/events/:path*", "/file/:path*", "/grpc/:path*", "/job/:path*",
    "/queue/:path*", "/sftp/:path*", "/tokenApp/:path*",

  ],
};