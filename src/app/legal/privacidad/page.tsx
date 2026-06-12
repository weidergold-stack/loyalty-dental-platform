import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Sonrisa+",
};

const LAST_UPDATED = "12 de junio de 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Política de Tratamiento de Datos Personales</h1>
      <p>Última actualización: {LAST_UPDATED}</p>

      <p>
        Sonrisa+ es una plataforma de software como servicio (&quot;SaaS&quot;) que
        provee a clínicas odontológicas (cada una, una &quot;Clínica&quot; o
        &quot;Cliente&quot;) herramientas de fidelización, membresías, cashback,
        sellos y seguimiento de salud oral para sus pacientes (&quot;Usuarios&quot;
        o &quot;Pacientes&quot;). Esta política describe cómo se recolectan,
        usan, almacenan y protegen los datos personales tratados a través de
        la plataforma, en cumplimiento de la Ley 1581 de 2012 y el Decreto
        1377 de 2013 de la República de Colombia (régimen de protección de
        datos personales o &quot;Habeas Data&quot;), así como de otras normas
        aplicables.
      </p>

      <h2>1. Roles frente al tratamiento de datos</h2>
      <p>
        <strong>Sonrisa+ actúa como Encargado del Tratamiento.</strong> Procesamos
        los datos personales de los Pacientes únicamente siguiendo las
        instrucciones de la Clínica correspondiente, para prestar el servicio
        contratado por dicha Clínica.
      </p>
      <p>
        <strong>Cada Clínica actúa como Responsable del Tratamiento</strong> de
        los datos de sus propios pacientes. Es responsabilidad de la Clínica
        contar con el consentimiento informado de sus pacientes, informarles
        esta política o una propia equivalente, y atender los derechos de los
        titulares conforme a la ley.
      </p>

      <h2>2. Datos que recolectamos</h2>
      <h3>2.1 Datos de las Clínicas (Clientes del SaaS)</h3>
      <ul>
        <li>Datos de identificación y contacto del titular de la cuenta y su personal autorizado (nombre, correo, teléfono).</li>
        <li>Información de la clínica (nombre comercial, logo, colores de marca, datos de contacto).</li>
        <li>Información de facturación y configuración de la pasarela de pagos (Wompi): llaves públicas y secretos de integración, que la Clínica configura para procesar sus propios cobros. Sonrisa+ no almacena números de tarjeta ni códigos de seguridad; estos son procesados directamente por Wompi.</li>
        <li>Datos de uso de la plataforma (registros de acceso, configuración del programa de fidelización).</li>
      </ul>

      <h3>2.2 Datos de los Pacientes (usuarios finales de cada Clínica)</h3>
      <ul>
        <li><strong>Datos de identificación y contacto:</strong> nombre, correo electrónico, número de teléfono.</li>
        <li><strong>Datos de la membresía y fidelización:</strong> nivel de membresía, sellos acumulados, cashback, saldo de salud oral, referidos, historial de transacciones.</li>
        <li>
          <strong>Datos sensibles de salud:</strong> información relacionada con la salud oral del paciente (por ejemplo, tratamientos, evoluciones clínicas y notas registradas por la Clínica). Estos datos se consideran datos sensibles bajo la ley colombiana y se tratan con un nivel de protección reforzado. La recolección de estos datos es responsabilidad de la Clínica, quien debe contar con la autorización expresa del paciente.
        </li>
        <li><strong>Datos de pago:</strong> registros de transacciones (monto, estado, referencia) asociados al pago de membresías. Los datos completos de tarjetas son procesados y almacenados por Wompi, no por Sonrisa+.</li>
        <li><strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo y navegador, y datos de uso de la aplicación, recolectados con fines de seguridad, soporte y mejora del servicio.</li>
      </ul>

      <h2>3. Finalidades del tratamiento</h2>
      <ul>
        <li>Crear y administrar las cuentas de Clínicas y Pacientes.</li>
        <li>Operar el programa de fidelización: membresías, sellos, cashback y saldo de salud oral.</li>
        <li>Procesar pagos de membresías a través de Wompi, según la configuración de cada Clínica.</li>
        <li>Enviar comunicaciones transaccionales relacionadas con el servicio (confirmaciones, recibos, recuperación de contraseña, recordatorios de citas).</li>
        <li>Brindar soporte técnico y atender solicitudes de los titulares.</li>
        <li>Cumplir obligaciones legales, contables y de seguridad de la información.</li>
        <li>Mejorar la plataforma y prevenir fraude o uso indebido.</li>
      </ul>

      <h2>4. Almacenamiento e infraestructura</h2>
      <p>
        Los datos se almacenan en bases de datos administradas por Supabase y
        la aplicación se despliega sobre la infraestructura de Vercel,
        proveedores que pueden alojar información en servidores ubicados fuera
        de Colombia. Al usar la plataforma, el titular acepta esta
        transferencia internacional de datos, la cual se realiza bajo
        estándares de seguridad equivalentes a los exigidos por la
        legislación colombiana, incluyendo cifrado en tránsito y en reposo, y
        controles de acceso basados en roles (Row Level Security), que
        garantizan que cada Clínica solo pueda acceder a los datos de sus
        propios pacientes.
      </p>

      <h2>5. Derechos de los titulares</h2>
      <p>
        Conforme a la Ley 1581 de 2012, los titulares de los datos personales
        tienen derecho a:
      </p>
      <ul>
        <li>Conocer, actualizar y rectificar sus datos personales.</li>
        <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
        <li>Ser informados sobre el uso que se ha dado a sus datos.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.</li>
        <li>Revocar la autorización y/o solicitar la supresión del dato, cuando no exista un deber legal o contractual de mantenerlo.</li>
        <li>Acceder de forma gratuita a sus datos personales tratados.</li>
      </ul>
      <p>
        Para ejercer estos derechos, los Pacientes deben contactar directamente
        a su Clínica (Responsable del Tratamiento). Las Clínicas pueden
        contactar a Sonrisa+ escribiendo a{" "}
        <a href="mailto:weidergold@gmail.com">weidergold@gmail.com</a> para
        solicitar la ejecución técnica de estas solicitudes sobre la
        plataforma (por ejemplo, eliminación de cuentas o exportación de
        datos).
      </p>

      <h2>6. Seguridad de la información</h2>
      <p>
        Implementamos medidas técnicas y organizativas razonables para proteger
        los datos personales contra acceso no autorizado, pérdida o alteración,
        incluyendo cifrado de comunicaciones (HTTPS/TLS), control de acceso por
        clínica mediante políticas de seguridad a nivel de fila en la base de
        datos, autenticación segura y verificación de la firma de los webhooks
        de pago.
      </p>

      <h2>7. Menores de edad</h2>
      <p>
        La plataforma no está dirigida a menores de edad. Si una Clínica
        registra datos de pacientes menores de edad, dicha Clínica es
        responsable de obtener la autorización del representante legal
        correspondiente, conforme a la ley.
      </p>

      <h2>8. Cambios a esta política</h2>
      <p>
        Esta política puede actualizarse periódicamente para reflejar cambios
        en el servicio o en la normativa aplicable. La fecha de &quot;última
        actualización&quot; indicada al inicio de este documento refleja la
        versión vigente. Cambios sustanciales serán comunicados a las Clínicas
        a través de los canales de contacto registrados.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para cualquier consulta relacionada con el tratamiento de datos
        personales en Sonrisa+, puedes escribir a{" "}
        <a href="mailto:weidergold@gmail.com">weidergold@gmail.com</a>.
      </p>
    </>
  );
}
