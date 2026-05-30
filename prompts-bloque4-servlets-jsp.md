# Prompts PAW — Bloque 4: Servlets / JSP
## Instrucciones de uso

Ejecutar en orden: **Prompt 1 → Prompt 2 → Prompt 3**, cada uno en una sesión de
Claude Code independiente. El Prompt 1 crea el fichero con 7 secciones + 7 stubs.
El Prompt 2 rellena los stubs de patrones/sesión/cookies. El Prompt 3 completa
filtros/utilidades y ejecuta el checklist de cierre.

---

# PROMPT 1 de 3 — "El Servlet y la Vista"
## Secciones 1–7: Motivación · Estructura · Ciclo de vida · Request/Response · JSP · EL/JSTL · Ámbitos

---

## 1. INSTRUCCIONES PREVIAS — leer en este orden exacto

1. `view CONTEXT.md` — estado actual del proyecto y reglas generales.
2. `view ERRORS.md` — **ERR-001 es crítico**: escapar `{` como `&#123;` y `}` como `&#125;` en TODO bloque `<pre><code>` dentro de `.astro`. Sin excepciones.
3. `view CONVENTIONS.md` — paleta, componentes, patrones visuales.
4. `view SKILLS/SKILL.md` — autoridad de diseño PAW.
5. `view EXAMEN.md` — prioridades del profesor y ejercicios probables.
6. Verificar que `src/pages/servlets-jsp.astro` tiene estado ⬜ en CONTEXT.md.
7. Si el fichero tiene contenido real (no la plantilla vacía), **DETENERSE** y reportar.

---

## 2. ESTADO Y TAREA

- **Bloque**: Bloque 4 — Servlets / JSP  
- **Fichero objetivo**: `src/pages/servlets-jsp.astro`  
- **Estado actual**: ⬜ Pendiente (página vacía)  
- **Esta sesión**: Crear la página completa con las secciones 1–7 desarrolladas y las secciones 8–14 como stubs HTML exactos (serán rellenados por los Prompts 2 y 3).  
- **Al terminar**: cambiar estado de ⬜ a 🔄 en CONTEXT.md. NO ejecutar checklist de cierre completo.

---

## 3. ARRAY DE SECCIONES — sidebar completo (todas las del bloque)

```js
const sections = [
  { id: "motivacion",           label: "Por qué servlets" },
  { id: "servlet-estructura",   label: "Estructura del servlet" },
  { id: "ciclo-vida",           label: "Ciclo de vida" },
  { id: "request-response",     label: "Request y Response" },
  { id: "jsp-vistas",           label: "JSP como vista" },
  { id: "el-jstl",              label: "EL y JSTL" },
  { id: "scopes",               label: "Ámbitos de datos" },
  { id: "patrones-prg",         label: "Patrón PRG" },
  { id: "patrones-controlador", label: "Controladores: Page vs Front" },
  { id: "patrones-dto",         label: "DTO y Template View" },
  { id: "cookies",              label: "Cookies" },
  { id: "sesion",               label: "Gestión de sesión" },
  { id: "filtros",              label: "Filtros" },
  { id: "utilidades",           label: "Utilidades" },
];
```

---

## 4. CABECERA DE LA PÁGINA

- **`<h1>`**: `Servlets / JSP`  
- **Párrafo `lead`**: `Controladores, vistas, estado y patrones en Jakarta EE`

---

## 5. CONTENIDO DETALLADO — secciones 1–7

### Sección 1 — `#motivacion` · "Por qué servlets"

**`callout-examen`**: "Peso bajo. Contexto para entender MVC. El JSP con lógica es el anti-patrón de partida; el servlet es la solución."

**SVG 1** — "Separación de responsabilidades" (`viewBox="0 0 780 280"`):  
Dos paneles separados por línea vertical central. **Panel izquierdo — ANTES**: título "Sin separación" en `--color-text-2`. Una única caja "ficha.jsp" con dos zonas superpuestas en su interior: zona azul muy pálida etiquetada "HTML" y zona ámbar muy pálida etiquetada "Lógica Java". Texto pequeño dentro: "acceso BD", "redirecciones", "redirigir si null". Flecha de petición entrando y saliendo del mismo bloque. **Panel derecho — DESPUÉS**: título "MVC". Tres cajas: "Controlador (Servlet)" arriba conectada con flecha "forward →" a "Vista (JSP)". Debajo del Controlador, caja "Modelo / Servicio" conectada con flecha punteada "lee / escribe". La Vista solo recibe una flecha unidireccional. Todos los bordes usan `var(--color-border)`, fondos `var(--color-surface)` y `var(--color-surface-2)`. Texto en `var(--color-text)`.

**Texto**: 2 párrafos. (1) Un JSP con scriptlets mezcla lógica de negocio, acceso a BD y generación de HTML en el mismo fichero. El resultado es imposible de testear y difícil de mantener. (2) La solución es el patrón MVC: el Servlet actúa como controlador (recibe la petición, delega al servicio, prepara los datos), el JSP solo visualiza lo que el controlador dejó preparado.

**Código** — anti-patrón (ERR-001 aplicado):

```java
// ❌ JSP con lógica — anti-patrón
// La vista accede a BD y decide a dónde redirigir
String cart = request.getParameter("cart");
if (cart == null) &#123; response.sendRedirect("error.html"); return; &#125;
Articulo art = new GestorBD().getArticulo(cart); // acceso a BD directo en la vista
```

Texto entre bloques: "El controlador asume esas responsabilidades, dejando la vista limpia:"

**Código** — patrón correcto (ERR-001 aplicado):

```java
// ✓ Servlet controller
public class FichaController extends HttpServlet &#123;
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException &#123;
    String cart = req.getParameter("cart");
    if (cart == null) &#123; resp.sendRedirect("error.html"); return; &#125;
    Articulo art = servicioArticulos.getArticulo(cart); // delega al servicio
    req.setAttribute("art", art);                       // prepara datos para la vista
    req.getRequestDispatcher("ficha.jsp").forward(req, resp);
  &#125;
&#125;
```

**`callout-key`**: "La vista solo visualiza. Las decisiones de navegación y el acceso a datos son responsabilidad del controlador."

---

### Sección 2 — `#servlet-estructura` · "Estructura del servlet"

**`callout-examen`**: "Peso alto. La estructura de un controlador Servlet es la base de todos los ejercicios. Saber escribir doGet y doPost con confianza. Referencia: P4, P5."

**SVG 2** — "URL mapping" (`viewBox="0 0 720 200"`):  
Flujo horizontal. Caja "Cliente" → flecha "GET /listado" → caja "Servidor (Tomcat)" con tabla interna de dos filas: `/listado → ListadoCtrl` y `/ficha → FichaCtrl` → flecha → caja "ListadoController" con recuadro interno "doGet()". Una segunda flecha desde el cliente "POST /comprar" que apunta al mapa y de ahí a "ComprarController → doPost()". Las cajas de los controladores tienen borde `var(--color-accent)` para distinguirlas.

**Texto**: HttpServlet es la clase base. Un servlet se corresponde con una URL o patrón de URL. El servidor invoca el método doXxx que corresponde al verbo HTTP de la petición recibida.

**Tabla** — "Métodos HTTP y sus manejadores" (comparison-table, 5 filas):

| Método HTTP | Método Servlet    | Cuándo usarlo                                      |
|-------------|-------------------|----------------------------------------------------|
| GET         | `doGet()`         | Consultar / mostrar datos. El más habitual.        |
| POST        | `doPost()`        | Crear o modificar datos (envío de formularios).    |
| PUT         | `doPut()`         | Reemplazar recurso completo (APIs REST).           |
| PATCH       | `doPatch()`       | Actualizar parcialmente un recurso (APIs REST).    |
| DELETE      | `doDelete()`      | Eliminar un recurso (APIs REST).                   |

**Código** — servlet mínimo con anotación (ERR-001 aplicado):

```java
@WebServlet(urlPatterns = &#123;"/listado"&#125;)
public class ListadoController extends HttpServlet &#123;

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException &#123;
    // 1. Leer parámetros
    String pagina = request.getParameter("pagina");

    // 2. Delegar al servicio (lógica de negocio)
    List<Articulo> articulos = servicioArticulos.getListado(pagina);

    // 3. Pasar datos a la vista (request scope)
    request.setAttribute("articulos", articulos);

    // 4. Delegar a la vista (forward interno)
    request.getRequestDispatcher("/vistas/listado.jsp")
           .forward(request, response);
  &#125;
&#125;
```

**Código** — configuración equivalente en web.xml:

```xml
<servlet>
  <servlet-name>ListadoController</servlet-name>
  <servlet-class>es.unirioja.paw.ListadoController</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>ListadoController</servlet-name>
  <url-pattern>/listado</url-pattern>
</servlet-mapping>
```

Texto: "La anotación `@WebServlet` y `web.xml` son equivalentes. Si ambos existen, `web.xml` tiene precedencia. Desde Servlet 3.0 se prefieren las anotaciones."

**`callout-tip`**: "TRUCO: si `doGet` y `doPost` deben hacer lo mismo, crea un método privado `processRequest()` e invócalo desde ambos."

**`callout-warning`**: "Si el servidor recibe un verbo HTTP para el que no hay `doXxx` implementado, devuelve **405 Method Not Allowed**."

---

### Sección 3 — `#ciclo-vida` · "Ciclo de vida"

**`callout-examen`**: "Peso medio. El modelo instancia única + N hilos puede aparecer en teoría. El bug de las variables de instancia es un clásico de examen."

**SVG 3** — "Ciclo de vida del servlet" (`viewBox="0 0 760 170"`):  
Flujo horizontal de 5 estados en rectángulos redondeados conectados por flechas con etiquetas. Estados: `Inactivo` → `(carga)` → `Cargado` → `init()` → `Activo` → `service() × N` → `Atendiendo` → `destroy()` → `Destruido`. El estado `Activo` y la flecha `service()` tienen tres flechas paralelas etiquetadas "hilo 1", "hilo 2", "hilo 3" que se bifurcan y reconvergen, ilustrando concurrencia. El estado "Activo" usa `var(--color-accent-light)` como fondo. Nota bajo el diagrama: "Una sola instancia · N hilos simultáneos".

**Texto**: El contenedor crea **una única instancia** del servlet cuando llega la primera petición (o al arrancar, si está configurado así). Esa misma instancia atiende todas las peticiones posteriores con hilos concurrentes. Ventaja sobre CGI: sin overhead de crear proceso por petición.

**Código** — ¡NUNCA HACER! (ERR-001 aplicado):

```java
// ❌ NUNCA: variables de instancia con datos de la petición
public class BugServlet extends HttpServlet &#123;
  private String nombre; // compartida entre TODOS los hilos
  private int edad;      // compartida entre TODOS los hilos

  protected void doGet(HttpServletRequest req, HttpServletResponse resp) &#123;
    nombre = req.getParameter("nombre"); // ¿de cuál de los 10 hilos simultáneos?
    edad   = Integer.parseInt(req.getParameter("edad"));
    // Petición del usuario A puede sobreescribir los datos del usuario B
  &#125;
&#125;
```

**Código** — correcto (ERR-001 aplicado):

```java
// ✓ Variables locales al método: cada hilo tiene las suyas
public class CorrectServlet extends HttpServlet &#123;
  // Solo recursos compartidos thread-safe como variables de instancia:
  private final ServicioArticulos servicio = new ServicioArticulos();

  protected void doGet(HttpServletRequest req, HttpServletResponse resp) &#123;
    String nombre = req.getParameter("nombre"); // local → segura por hilo
    int    edad   = Integer.parseInt(req.getParameter("edad")); // local → segura
  &#125;
&#125;
```

**`callout-warning`**: "NUNCA guardar parámetros de petición ni datos de usuario en variables de instancia del servlet. Solo variables locales o recursos thread-safe."

**`callout-key`**: "Una sola instancia · N hilos simultáneos · Solo variables locales en los métodos doXxx."

**Código** — `init()` y `destroy()` (ERR-001 aplicado):

```java
public class AppServlet extends HttpServlet &#123;
  private DataSource dataSource;

  @Override
  public void init() throws ServletException &#123;
    // Ejecutado UNA VEZ al cargar el servlet
    // Obtener recursos compartidos del ServletContext
    dataSource = (DataSource) getServletContext().getAttribute("dataSource");
  &#125;

  @Override
  public void destroy() &#123;
    // Ejecutado UNA VEZ al destruir el servlet
    // Liberar recursos adquiridos en init()
  &#125;
&#125;
```

---

### Sección 4 — `#request-response` · "Request y Response"

**`callout-examen`**: "Peso alto. `setAttribute` / `getAttribute` para pasar datos del controller a la vista (forward) es el mecanismo central de P4 S1. La diferencia forward/redirect es la base del patrón PRG."

**Tabla 1** — "API de HttpServletRequest" (comparison-table, 11 filas):

| Método                         | Para qué sirve                                                   |
|--------------------------------|------------------------------------------------------------------|
| `getParameter(name)`           | Parámetro de query string o de formulario POST                   |
| `getParameterValues(name)`     | Array de valores (checkboxes, select múltiple)                   |
| `getHeader(name)`              | Cabecera HTTP de la petición                                     |
| `getSession()`                 | Sesión actual (la crea si no existe)                             |
| `getSession(false)`            | Sesión actual o `null` si no existe — **no la crea**            |
| `setAttribute(name, obj)`      | Guarda objeto en el ámbito de la petición (para forward)         |
| `getAttribute(name)`           | Recupera objeto del ámbito de la petición                        |
| `getRequestDispatcher(path)`   | Para hacer forward o include a otro recurso                      |
| `getCookies()`                 | Array de cookies enviadas por el navegador                       |
| `getMethod()`                  | Verbo HTTP: "GET", "POST", etc.                                  |
| `getContextPath()`             | Ruta raíz de la aplicación (ej. `/MiApp`)                        |

**Tabla 2** — "API de HttpServletResponse" (comparison-table, 6 filas):

| Método                     | Para qué sirve                                                |
|----------------------------|---------------------------------------------------------------|
| `setContentType(type)`     | Tipo MIME de la respuesta (ej. `text/html;charset=UTF-8`)     |
| `getWriter()`              | `PrintWriter` para escribir la respuesta directamente         |
| `sendRedirect(url)`        | Envía respuesta 302 al navegador para ir a otra URL           |
| `addCookie(cookie)`        | Añade cookie a la respuesta (`Set-Cookie` header)             |
| `setStatus(code)`          | Establece código HTTP de respuesta                            |
| `sendError(code, msg)`     | Envía respuesta de error con código HTTP y mensaje            |

**SVG 4** — "Forward vs Redirect" (`viewBox="0 0 780 280"`):  
Dos paneles. **Panel izquierdo — forward**: tres actores verticales: `Navegador`, `Servlet A`, `Vista JSP`. Flechas: (1) Navegador → "GET /listado" → Servlet A; (2) [internamente en servidor] Servlet A → "getRequestDispatcher().forward()" → Vista JSP; (3) Vista JSP → "HTML" → Navegador. Recuadro bajo el panel: "URL en barra del navegador: `/listado` (sin cambio)". Nota: "server-side · mismo request". **Panel derecho — redirect**: tres actores. Flechas: (1) Navegador → "POST /comprar" → Servlet A; (2) Servlet A → "302 Location: /carro" → Navegador; (3) Navegador → "GET /carro (nueva petición)" → Servlet B; (4) Servlet B → "HTML" → Navegador. Recuadro: "URL en barra: `/carro` (cambiada)". Nota: "client-side · nuevo request · datos del req.setAttribute se PIERDEN". Línea vertical central separando los paneles.

**`callout-key`**: "forward: mismo request/response, URL no cambia, datos en `setAttribute` llegan al JSP. redirect: nueva petición, URL cambia, datos del setAttribute se pierden."

**`callout-relation`**: "La diferencia forward/redirect es la base del Patrón PRG, desarrollado en la sección `#patrones-prg`."

**Código** — forward (ERR-001 aplicado):

```java
// Forward: pasar datos al JSP dentro de la misma petición
protected void doGet(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException &#123;
  List<Articulo> lista = servicioArticulos.getListado();
  req.setAttribute("articulos", lista);  // el JSP leerá ${articulos}

  RequestDispatcher rd = req.getRequestDispatcher("/vistas/listado.jsp");
  rd.forward(req, resp);  // la URL del navegador sigue siendo la original
&#125;
```

**Código** — redirect (ERR-001 aplicado):

```java
// Redirect: ordenar al navegador ir a otra URL (nueva petición)
protected void doPost(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException &#123;
  servicioCompras.añadirAlCarro(req.getSession(), req.getParameter("id"));

  // PRG: redirigir para que F5 no repita el POST
  resp.sendRedirect(req.getContextPath() + "/carro");
  // Los datos de setAttribute se pierden — el nuevo GET no tiene acceso a ellos
&#125;
```

---

### Sección 5 — `#jsp-vistas` · "JSP como vista"

**`callout-examen`**: "Peso bajo. JSP es la tecnología de vista. Lo principal: sin lógica en JSP (sin scriptlets). EL y JSTL son la alternativa moderna."

**SVG 5** — "JSP: de plantilla a HTML" (`viewBox="0 0 720 180"`):  
Flujo horizontal. Caja "ficha.jsp" (fondo surface-2, texto pequeño con `${art.nombre}` visible) → flecha con label "compilación automática (primera vez)" → caja "\_FichaJsp.java (Servlet generado por Tomcat)" → flecha "petición HTTP" → caja "HTML enviado al navegador". La segunda caja tiene borde de trazo punteado (es generada, no escrita por el desarrollador). Bajo el JSP: "Plantilla HTML + marcadores EL + etiquetas JSTL".

**Tabla** — "Elementos JSP: cuándo usar cada uno" (comparison-table, 7 filas):

| Elemento           | Sintaxis                  | Estado      | Alternativa             |
|--------------------|---------------------------|-------------|-------------------------|
| Scriptlet          | `<% código Java %>`       | ❌ Prohibido | EL + JSTL               |
| Expresión          | `<%= valor %>`            | ❌ Prohibido | `${valor}` con EL       |
| Declaración        | `<%! var/método %>`       | ❌ Prohibido | Clase Java separada     |
| Directiva `page`   | `<%@ page ... %>`         | ✓ OK        | —                       |
| Directiva `taglib` | `<%@ taglib ... %>`       | ✓ Necesario | —                       |
| EL                 | `${expresión}`            | ✓ Usar      | —                       |
| JSTL               | `<c:forEach>`, etc.       | ✓ Usar      | —                       |

**Código** — antes: JSP con scriptlets (ERR-001 aplicado):

```jsp
<%-- ❌ JSP con scriptlets — difícil de mantener --%>
<%@ page contentType="text/html;charset=UTF-8" %>
<ul>
<% List<Articulo> arts = (List<Articulo>) request.getAttribute("articulos");
   for (Articulo a : arts) &#123; %>
  <li><%= a.getNombre() %> — <%= a.getPrecio() %> €</li>
<% &#125; %>
</ul>
```

**Código** — después: JSP moderno (ERR-001 aplicado):

```jsp
<%-- ✓ JSP moderno: solo EL y JSTL --%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<ul>
  <c:forEach items="$&#123;articulos&#125;" var="a">
    <li>$&#123;a.nombre&#125; — $&#123;a.precio&#125; €</li>
  </c:forEach>
</ul>
```

**`callout-key`**: "En JSP moderno: cero scriptlets. Solo EL (`${...}`) y JSTL. El HTML debe ser legible sin conocer Java."

**Tabla** — "Objetos implícitos más usados" (comparison-table, 5 filas):

| Nombre en JSP             | Tipo Jakarta EE       | Equivalente en Servlet          |
|---------------------------|-----------------------|---------------------------------|
| `request` / `${param}`   | HttpServletRequest    | parámetro del método doXxx      |
| `session` / `${sessionScope}` | HttpSession       | `request.getSession()`          |
| `application` / `${applicationScope}` | ServletContext | `getServletContext()`    |
| `${cookie}`               | Map de Cookie         | `request.getCookies()`          |
| `out`                     | JspWriter             | `response.getWriter()`          |

---

### Sección 6 — `#el-jstl` · "EL y JSTL"

**`callout-examen`**: "Peso bajo. Leer para contexto; no memorizar la API completa. Sí entender `${sessionScope.usuario.nombre}` y `<c:forEach>` básico."

**SVG 6** — "Resolución de `${articulo}` en los ámbitos" (`viewBox="0 0 760 110"`):  
Flujo horizontal. A la izquierda: caja `${articulo}` con flecha. Luego 4 cajas en secuencia: `pageScope` → `requestScope` → `sessionScope` → `applicationScope` → caja `null`. Entre cada par de cajas, flecha con label "¿encontrado?" sobre ella. La caja `requestScope` tiene fondo `var(--color-accent-light)` con check "✓ encontrado aquí" para ilustrar el caso más habitual. Las cajas posteriores a la encontrada están en `var(--color-text-3)` (opacidad reducida). Bajo el diagrama: "EL busca en orden hasta encontrar el valor o devolver null."

**Texto**: EL (`${...}`) simplifica el acceso a objetos en los ámbitos sin casting, con acceso a propiedades por punto (llama a getters automáticamente). Soporta operadores aritméticos (`+`, `-`, `*`, `/`), relacionales (`==`, `!=`, `<`, `>`), lógicos (`&&`, `||`, `!`) y ternario.

**Tabla** — "JSTL Core: etiquetas esenciales" (comparison-table, 8 filas):

| Etiqueta                              | Uso                                    |
|---------------------------------------|----------------------------------------|
| `<c:out value="...">`                 | Imprime con escape HTML automático     |
| `<c:set var="x" value="..." scope="">` | Define variable en un scope            |
| `<c:if test="${...}">`                | Condicional simple                     |
| `<c:choose>/<c:when>/<c:otherwise>`   | If–else complejo (switch)              |
| `<c:forEach items="${lista}" var="x">` | Iterar colección (List, Map, array)    |
| `<c:forEach begin="1" end="10" var="i">` | Iterar rango numérico               |
| `<c:url value="/path">`               | URL con encoding correcto              |
| `<c:redirect url="...">`             | Redirect desde JSP (mejor en servlet) |

**Código** — ejemplo completo con los 3 patrones más usados (ERR-001 aplicado):

```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- 1. Acceso a sesión --%>
<c:if test="$&#123;sessionScope.usuario != null&#125;">
  <p>Bienvenido, $&#123;sessionScope.usuario.nombre&#125;</p>
</c:if>

<%-- 2. Iterar lista del request --%>
<ul>
  <c:forEach items="$&#123;requestScope.articulos&#125;" var="art" varStatus="st">
    <li>$&#123;st.count&#125;. $&#123;art.nombre&#125; — $&#123;art.precio&#125; €</li>
  </c:forEach>
</ul>

<%-- 3. Condicional choose --%>
<c:choose>
  <c:when test="$&#123;empty articulos&#125;">
    <p>No hay artículos disponibles.</p>
  </c:when>
  <c:otherwise>
    <p>Se muestran $&#123;fn:length(articulos)&#125; artículos.</p>
  </c:otherwise>
</c:choose>
```

**`callout-tip`**: "EL implícitos más útiles en el examen: `${param.nombre}` (parámetros de la petición), `${sessionScope.usuario}` (sesión), `${cookie.JSESSIONID.value}` (cookie de sesión)."

---

### Sección 7 — `#scopes` · "Ámbitos de datos"

**`callout-examen`**: "Peso alto. La diferencia request vs session scope es fundamental. ¿Qué se guarda en request? ¿Qué en session? Referencia directa: P4 S1 (datos de listado en request), P5 y P6 (usuario en session)."

**SVG 7** — "Los cuatro ámbitos de datos" (`viewBox="0 0 720 300"`):  
Cuatro rectángulos concéntricos (el más exterior es el más largo en vida). Todos con rellenos muy pálidos usando las custom properties del proyecto. De fuera a dentro:
- **application** (borde y fondo `--color-key-bg`): label en la esquina superior izquierda "application · toda la aplicación". Texto pequeño en su interior: "DataSource, configuración global, estadísticas".  
- **session** (fondo `--color-relation-bg`): label "session · sesión del usuario". Texto: "usuario autenticado, carrito de la compra".  
- **request** (fondo `--color-tip-bg`): label "request · una petición / cadena de forwards". Texto: "listado de artículos, errores de validación".  
- **page** (fondo `--color-warning-bg`): label "page · un solo JSP". Texto: "variables auxiliares de la vista".

**Tabla** — "Comparativa de ámbitos" (comparison-table, 4 filas):

| Ámbito        | Duración                     | API en Servlet                            | EL                          | Usar para…                          |
|---------------|------------------------------|-------------------------------------------|-----------------------------|-------------------------------------|
| `page`        | Solo el JSP actual           | No existe en servlets                     | `pageContext`               | Variables locales del JSP            |
| `request`     | Una petición (o chain de forwards) | `req.setAttribute/getAttribute`     | `${nombre}`                 | Pasar datos de controller a vista    |
| `session`     | Sesión del usuario           | `session.setAttribute/getAttribute`       | `${sessionScope.nombre}`   | Autenticación, carrito               |
| `application` | Toda la aplicación           | `ctx.setAttribute/getAttribute`           | `${applicationScope.nombre}` | Config. global, recursos cacheados |

**Texto**: La regla de oro: usar el scope más pequeño que cubra la necesidad.

**`callout-key`**: "Regla de oro: request para pasar datos del controlador a la vista. session solo para lo que debe sobrevivir entre peticiones del mismo usuario. Nunca usar session para lo que cabe en request."

**`callout-warning`**: "Los objetos en session deben implementar `Serializable`. Una session grande penaliza el rendimiento, especialmente con balanceo de carga."

**Código** — uso de los tres scopes principales (ERR-001 aplicado):

```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException &#123;
  // request scope: datos temporales para esta vista
  req.setAttribute("articulos", servicioArticulos.getListado());

  // session scope: datos persistentes entre peticiones del usuario
  HttpSession session = req.getSession(false); // no crear si no existe
  Usuario usuario = (session != null)
    ? (Usuario) session.getAttribute("usuario")
    : null;

  // application scope: datos globales (raramente se escribe aquí)
  String version = (String) getServletContext().getAttribute("app.version");

  req.getRequestDispatcher("/vistas/listado.jsp").forward(req, resp);
&#125;
```

---

## 6. STUBS PARA SECCIONES 8–14

Después de la sección `#scopes`, generar los siguientes stubs HTML con los comentarios exactos indicados. Estos comentarios serán usados como anclas por `str_replace` en los Prompts 2 y 3. **Copiar exactamente, sin modificar los comentarios.**

```html
<!-- PENDIENTE:patrones-prg -->
<section id="patrones-prg">
  <div class="callout callout-tip">
    <p>Esta sección será completada en la Sesión 2 (Patrones Web, Sesión y Cookies).</p>
  </div>
</section>
<!-- /PENDIENTE:patrones-prg -->

<!-- PENDIENTE:patrones-controlador -->
<section id="patrones-controlador">
  <div class="callout callout-tip">
    <p>Esta sección será completada en la Sesión 2.</p>
  </div>
</section>
<!-- /PENDIENTE:patrones-controlador -->

<!-- PENDIENTE:patrones-dto -->
<section id="patrones-dto">
  <div class="callout callout-tip">
    <p>Esta sección será completada en la Sesión 2.</p>
  </div>
</section>
<!-- /PENDIENTE:patrones-dto -->

<!-- PENDIENTE:cookies -->
<section id="cookies">
  <div class="callout callout-tip">
    <p>Esta sección será completada en la Sesión 2.</p>
  </div>
</section>
<!-- /PENDIENTE:cookies -->

<!-- PENDIENTE:sesion -->
<section id="sesion">
  <div class="callout callout-tip">
    <p>Esta sección será completada en la Sesión 2.</p>
  </div>
</section>
<!-- /PENDIENTE:sesion -->

<!-- PENDIENTE:filtros -->
<section id="filtros">
  <div class="callout callout-tip">
    <p>Esta sección será completada en la Sesión 3 (Filtros y Utilidades).</p>
  </div>
</section>
<!-- /PENDIENTE:filtros -->

<!-- PENDIENTE:utilidades -->
<section id="utilidades">
  <div class="callout callout-tip">
    <p>Esta sección será completada en la Sesión 3.</p>
  </div>
</section>
<!-- /PENDIENTE:utilidades -->
```

---

## 7. PROHIBICIONES

- NO tocar ningún bloque ✅ existente (fundamentos.astro, jdbc.astro, arquitectura.astro, examen.astro).
- NO modificar Navbar.astro, Sidebar.astro, Footer.astro, layouts, global.css sin avisar y recibir confirmación.
- **ERR-001 OBLIGATORIO**: escapar `{` → `&#123;` y `}` → `&#125;` en TODOS los bloques `<pre><code>` de `.astro`. Sin excepciones.
- NO usar emojis en HTML/CSS estructural (solo SVG o pseudo-elementos `::before`).
- NO usar `transition: all`. Especificar propiedad exacta.
- NO usar fuentes de la lista negra (Inter, DM Sans, Space Grotesk, etc.).
- NO usar hex hardcodeados. Solo custom properties del proyecto.
- NO usar `height: 100vh`. Usar `min-height: 100dvh`.
- NO usar `z-index` arbitrarios. Solo los tokens definidos.
- Hover con transform SIEMPRE envuelto en `@media (hover: hover) and (pointer: fine)`.
- NO animar `width`, `height`, `margin`, `padding`. Solo `transform` y `opacity`.

---

## 8. ACTUALIZACIÓN AL TERMINAR ESTA SESIÓN

1. Cambiar estado de `servlets-jsp.astro` en CONTEXT.md de ⬜ a 🔄.
2. Ejecutar `npx astro build` y confirmar build limpia.
3. Reportar: número de secciones creadas, SVGs generados, confirmación de ERR-001.
4. NO actualizar index.astro todavía.
5. NO añadir entrada al historial todavía (lo hace el Prompt 3).

---
---

# PROMPT 2 de 3 — "Patrones Web + Sesión + Cookies"
## Secciones 8–12: PRG · Page vs Front Controller · DTO · Cookies · Sesión

---

## 1. INSTRUCCIONES PREVIAS — leer en este orden exacto

1. `view CONTEXT.md` — verificar que `servlets-jsp.astro` está en estado 🔄.
2. `view ERRORS.md` — recordar ERR-001 (escapar llaves en `.astro`).
3. `view CONVENTIONS.md` — paleta, componentes, patrones.
4. `view SKILLS/SKILL.md` — autoridad de diseño.
5. `view EXAMEN.md` — prioridades: PRG y Front Controller son muy probables.
6. Leer el contenido actual de `src/pages/servlets-jsp.astro` con `view`.
7. Verificar que los 7 stubs `<!-- PENDIENTE:xxx -->` existen en el fichero. Si no existen, DETENERSE y reportar.

---

## 2. ESTADO Y TAREA

- **Bloque**: Bloque 4 — Servlets / JSP (continuación)
- **Esta sesión**: Reemplazar los 5 stubs de las secciones 8–12 con contenido completo.
- **Método**: `str_replace` para reemplazar cada bloque `<!-- PENDIENTE:xxx -->...<!-- /PENDIENTE:xxx -->` con el contenido completo de la sección.
- **Al terminar**: el estado sigue siendo 🔄 en CONTEXT.md. NO ejecutar checklist de cierre.

---

## 3. CONTENIDO DETALLADO — secciones 8–12

### Sección 8 — `#patrones-prg` · "Patrón PRG"

Reemplazar stub `<!-- PENDIENTE:patrones-prg -->...<!-- /PENDIENTE:patrones-prg -->` con:

**`callout-examen`**: "Peso muy alto. El patrón PRG resuelve el problema del botón recargar en formularios POST. Aparece explícitamente en P4 S2. El profesor lo menciona en la tutoría. Muy probable en el examen."

**Texto**: 2 párrafos. (1) El problema: HTTP es sin estado. Si la última acción del navegador fue un POST a `/comprar`, al pulsar F5 se repite el POST (otra compra no deseada). La solución NO es desactivar el botón de recarga. (2) La solución PRG: separar la operación en dos controladores con dos URLs. El primero procesa (POST) y redirige (302). El segundo solo muestra (GET). En el navegador queda la URL del GET, que se puede repetir sin efecto secundario.

**Tabla** — "Tipos de peticiones" (comparison-table, 2 filas):

| Tipo             | Descripción                                              | Verbo habitual | ¿Peligro con F5? |
|------------------|----------------------------------------------------------|----------------|------------------|
| Informativa      | Solo muestra datos, no modifica el modelo                | GET            | No — es seguro   |
| Funcional        | Modifica el estado de la aplicación (crear, borrar...)   | POST / PUT / DELETE | Sí — problema |

**SVG PRG** (`viewBox="0 0 780 300"`):  
Diagrama de secuencia con 3 actores verticales: `Navegador`, `Servidor A (POST /comprar)`, `Servidor B (GET /carro)`. Pasos numerados:  
(1) Navegador → POST /comprar?id=123 → Servidor A. Etiqueta lateral: "Petición funcional".  
(2) Servidor A (caja interna): "servicioCompras.añadir(id)". Flecha de procesamiento interna.  
(3) Servidor A → "302 Redirect → /carro" → Navegador. Flecha con etiqueta "Location: /carro".  
(4) Navegador → GET /carro → Servidor B. Etiqueta: "Nueva petición. Petición informativa."  
(5) Servidor B → HTML (estado actualizado) → Navegador.  
Bajo el diagrama, una nota: "F5 en este punto repite GET /carro — completamente seguro."  
El paso (3) usa `var(--color-accent)` para destacar la redirección como el mecanismo clave.

**`callout-key`**: "El POST procesa y redirige (302). El GET muestra. F5 solo repite el GET. Dos controladores, dos URLs."

**Código** — implementación PRG completa (ERR-001 aplicado):

```java
// Controlador 1: Procesa la acción (POST)
@WebServlet(urlPatterns = &#123;"/comprar"&#125;)
public class ComprarController extends HttpServlet &#123;
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException &#123;
    String idProducto = req.getParameter("id");

    // 1. Acción funcional: modifica el modelo
    servicioCompras.añadirAlCarro(req.getSession(), idProducto);

    // 2. PRG: redirigir a la URL informativa
    // El navegador hará GET /carro — F5 allí será inocuo
    resp.sendRedirect(req.getContextPath() + "/carro");
  &#125;
&#125;

// Controlador 2: Muestra el resultado (GET)
@WebServlet(urlPatterns = &#123;"/carro"&#125;)
public class CarroController extends HttpServlet &#123;
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException &#123;
    // 3. Leer el modelo ya actualizado
    Carro carro = servicioCompras.getCarro(req.getSession());
    req.setAttribute("carro", carro);

    // 4. Delegar a la vista
    req.getRequestDispatcher("/vistas/carro.jsp").forward(req, resp);
  &#125;
&#125;
```

**`callout-warning`**: "Error clásico: olvidar el `sendRedirect` en el POST y usar `forward` directamente. Resultado: F5 repite la compra. El patrón PRG existe exactamente para evitar esto."

---

### Sección 9 — `#patrones-controlador` · "Controladores: Page vs Front Controller"

Reemplazar stub `<!-- PENDIENTE:patrones-controlador -->...<!-- /PENDIENTE:patrones-controlador -->` con:

**`callout-examen`**: "Peso muy alto. Page Controller vs Front Controller. El Front Controller es la base de Spring MVC (el DispatcherServlet). Referencia: P5 (el filtro de auth actúa junto al Front Controller)."

**SVG PageController vs FrontController** (`viewBox="0 0 780 320"`):  
Dos paneles separados por línea vertical. **Panel izquierdo — Page Controller**: título "Page Controller". Múltiples grupos de cajas, cada grupo con: URL → Controller → Vista. Tres grupos: `/listado → ListadoController`, `/ficha → FichaController`, `/carro → CarroController`. En cada controller, un bloque interior en rojo muy pálido etiquetado "auth check (repetido)", "logging (repetido)". Flecha doble bajo el panel señalando "código duplicado". **Panel derecho — Front Controller**: título "Front Controller". Una sola caja grande "DispatcherServlet" al tope con "auth, logging, i18n (centralizado)". Dentro del DispatcherServlet, tres flechas hacia abajo a "ListadoHandler", "FichaHandler", "CarroHandler". Estos handlers ya NO tienen el código repetido. Label: "Un punto de entrada · N manejadores especializados".

**Tabla** — "Comparativa de patrones de controlador" (comparison-table, 4 filas):

| Aspecto              | Page Controller                                | Front Controller                             |
|----------------------|------------------------------------------------|----------------------------------------------|
| Entrada              | Un controller por URL / acción                 | Un único controller para todas las peticiones |
| Tareas comunes       | Repetidas en cada controller (auth, logs...)   | Centralizadas en el Front Controller          |
| Complejidad          | Simple al principio, explota al crecer          | Más complejo inicialmente, escala mejor       |
| Ejemplo real         | Servlets individuales en Tomcat                | `DispatcherServlet` de Spring MVC             |

**`callout-key`**: "Spring MVC implementa el Front Controller pattern a través del `DispatcherServlet`. Este mapea URLs a métodos de `@Controller` (los handlers)."

**Texto**: El Front Controller resuelve el principal defecto del Page Controller: la duplicación de lógica transversal (autenticación, logging, manejo de errores, i18n). Al centralizar estas responsabilidades, permite añadir nuevo comportamiento sin tocar los handlers individuales.

**Código** — Front Controller manual simplificado (ERR-001 aplicado):

```java
// Patrón Front Controller manual (antes de Spring MVC)
@WebServlet(urlPatterns = &#123;"*.do"&#125;) // captura todas las peticiones *.do
public class FrontController extends HttpServlet &#123;
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException &#123;
    processRequest(req, resp);
  &#125;

  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException &#123;
    processRequest(req, resp);
  &#125;

  private void processRequest(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException &#123;
    // 1. Lógica transversal centralizada
    if (!authService.isAuthenticated(req.getSession())) &#123;
      resp.sendRedirect("login.jsp");
      return;
    &#125;

    // 2. Dispatch al handler correcto según la URL
    String action = req.getServletPath();
    switch (action) &#123;
      case "/listado.do" -> new ListadoHandler().execute(req, resp);
      case "/ficha.do"   -> new FichaHandler().execute(req, resp);
      default -> resp.sendError(404);
    &#125;
  &#125;
&#125;
```

**`callout-relation`**: "En Spring MVC el `DispatcherServlet` es el Front Controller. Los métodos de las clases `@Controller` son los handlers. La anotación `@GetMapping` / `@PostMapping` hace el dispatch automáticamente."

---

### Sección 10 — `#patrones-dto` · "DTO y Template View"

Reemplazar stub `<!-- PENDIENTE:patrones-dto -->...<!-- /PENDIENTE:patrones-dto -->` con:

**`callout-examen`**: "Peso bajo. DTO como concepto de transferencia de datos entre capas. No memorizar la implementación; sí entender para qué sirve."

**Texto**: Un Data Transfer Object (DTO) es un objeto sin lógica de negocio que transporta datos de la capa de servicios a la capa de presentación. Contiene solo los datos que la vista necesita, protegiendo la vista de cambios en los objetos del modelo.

**Tabla** — "Características del DTO" (comparison-table, 2 columnas):

| Característica    | Por qué importa                                                 |
|-------------------|-----------------------------------------------------------------|
| Solo datos, sin lógica | La vista no ejecuta reglas de negocio                    |
| Puede agregar varios objetos | Evita múltiples llamadas a la capa de servicios  |
| Inmutable         | Evita modificaciones accidentales en la vista                   |
| Serializable      | Necesario si se envía por red o se guarda en sesión             |
| POJO              | Sin dependencias de framework, fácil de testear                 |

**Texto**: Template View es el patrón que usa JSP: HTML estático con marcadores (`${...}`) que se reemplazan dinámicamente. La reutilización de fragmentos se logra de dos formas: estilo include (cada vista incluye explícitamente los fragmentos comunes — `<jsp:include>`, Thymeleaf layout system) o estilo jerárquico (una plantilla maestra que cada vista especializa — Thymeleaf Layout Dialect, Facelets).

**`callout-tip`**: "En proyectos modernos con Spring + JPA, las interfaces de proyección de Spring Data JPA cumplen el papel del DTO sin código extra."

---

### Sección 11 — `#cookies` · "Cookies"

Reemplazar stub `<!-- PENDIENTE:cookies -->...<!-- /PENDIENTE:cookies -->` con:

**`callout-examen`**: "Peso bajo. Las cookies son el mecanismo de transporte del id de sesión. Lo principal: qué es `JSESSIONID` y cómo funciona el flujo. La API de Jakarta EE es complementaria."

**SVG Cookie flow** (`viewBox="0 0 760 180"`):  
Diagrama de secuencia simplificado. Actores: `Navegador`, `Servidor`. Cuatro pasos:  
(1) Navegador → petición GET → Servidor.  
(2) Servidor → respuesta + `Set-Cookie: miCookie=valor; Path=/; Max-Age=3600` → Navegador.  
(3) Navegador almacena en "almacén de cookies" (caja con borde sólido).  
(4) Siguiente petición: Navegador → `Cookie: miCookie=valor` → Servidor.  
Nota lateral: "La cookie solo se devuelve al dominio que la emitió (same-domain policy)."

**Texto**: Una cookie es un pequeño dato (texto) que el servidor envía al navegador y este devuelve en cada petición posterior al mismo dominio. El navegador no puede modificarlas (salvo con JavaScript). Son el mecanismo preferido para mantener el id de sesión.

**Tabla** — "Atributos de una cookie" (comparison-table, 6 filas):

| Atributo   | Función                                                                    |
|------------|----------------------------------------------------------------------------|
| `Domain`   | Dominio al que se devuelve la cookie (por defecto: el que la emitió)       |
| `Path`     | Ruta del servidor para la que aplica (por defecto: la URL que la emitió)   |
| `Expires`  | Fecha de expiración (cookie persistente si presente; de sesión si ausente) |
| `Max-Age`  | Segundos de vida. Toma precedencia sobre `Expires`. 0 = eliminar.          |
| `Secure`   | Solo se transmite por HTTPS                                                |
| `HttpOnly` | No accesible desde JavaScript (protege contra XSS)                        |

**Tabla** — "Tipos de cookies" (comparison-table, 5 filas):

| Tipo              | Descripción                                                            |
|-------------------|------------------------------------------------------------------------|
| De sesión         | Sin `Expires` ni `Max-Age`. Se elimina al cerrar el navegador.         |
| Persistente       | Con `Expires` o `Max-Age` positivo. Sobrevive al cierre del navegador. |
| Segura            | Flag `Secure`. Solo viaja por HTTPS.                                   |
| HttpOnly          | Flag `HttpOnly`. No accesible desde JavaScript.                        |
| First-party       | `Domain` igual al de la página. Propias del sitio.                     |
| Third-party       | `Domain` diferente. Usadas para tracking publicitario.                 |

**Código** — API Jakarta EE: enviar y recibir cookies (ERR-001 aplicado):

```java
// Enviar cookie desde un Servlet
Cookie ck = new Cookie("preferencia", "dark");
ck.setPath(req.getContextPath()); // devuelta a cualquier URL de la app
ck.setMaxAge(60 * 60 * 24 * 30); // 30 días
ck.setHttpOnly(true);             // no accesible desde JS
resp.addCookie(ck);

// Leer cookies en una petición
Cookie[] cookies = req.getCookies();
if (cookies != null) &#123;
  for (Cookie c : cookies) &#123;
    if ("preferencia".equals(c.getName())) &#123;
      String valor = c.getValue();
    &#125;
  &#125;
&#125;

// En JSP con EL (más cómodo):
// $&#123;cookie.preferencia.value&#125;
```

**`callout-key`**: "JSESSIONID es la cookie que Jakarta EE usa para identificar la sesión de cada usuario. Es de sesión (sin Expires) y HttpOnly por defecto."

---

### Sección 12 — `#sesion` · "Gestión de sesión"

Reemplazar stub `<!-- PENDIENTE:sesion -->...<!-- /PENDIENTE:sesion -->` con:

**`callout-examen`**: "Peso muy alto. HttpSession es la base del sistema de autenticación. `setAttribute` / `getAttribute` / `invalidate` son los tres métodos más importantes. El flujo login → filter → logout es el núcleo de P5 y P6."

**Texto**: HTTP es sin estado: cada petición es independiente. La sesión es la solución de Jakarta EE: un Map server-side asociado a cada usuario identificado por un token (JSESSIONID), transmitido como cookie o reescritura de URL.

**SVG Session lifecycle** (`viewBox="0 0 780 240"`):  
Línea de tiempo horizontal para un usuario. Eventos marcados en la línea:  
(1) "Primera petición" → "Sesión creada. JSESSIONID generado." → caja: `Set-Cookie: JSESSIONID=abc123`.  
(2) "Petición 2 con cookie" → "Sesión encontrada por JSESSIONID" → caja: `getAttribute("usuario")`.  
(3) "... más peticiones ..."  
(4) Dos finales posibles: rama superior "Timeout (30 min inactivo) → sesión destruida automáticamente"; rama inferior "invalidate() en logout → sesión destruida manualmente".  
Los estados de sesión activa usan `var(--color-tip-bg)` como fondo. Los estados destruidos usan `var(--color-surface-2)`.

**Tabla** — "API de HttpSession" (comparison-table, 8 filas):

| Método                              | Para qué sirve                                              |
|-------------------------------------|-------------------------------------------------------------|
| `setAttribute(name, obj)`           | Guarda objeto en la sesión                                  |
| `getAttribute(name)`                | Recupera objeto de la sesión (null si no existe)            |
| `removeAttribute(name)`             | Elimina objeto de la sesión                                 |
| `invalidate()`                      | Destruye la sesión y todos sus datos (logout)               |
| `getId()`                           | Devuelve el JSESSIONID                                      |
| `isNew()`                           | True si la sesión acaba de crearse en esta petición         |
| `setMaxInactiveInterval(segundos)`  | Tiempo de inactividad antes de que expire (default: 1800s) |
| `getLastAccessedTime()`             | Timestamp del último acceso                                 |

**Código** — patrón login / check / logout completo (ERR-001 aplicado):

```java
// --- LOGIN: guardar usuario en sesión ---
protected void doPost(HttpServletRequest req, HttpServletResponse resp) &#123;
  String user = req.getParameter("usuario");
  String pass = req.getParameter("password");

  Usuario u = servicioAuth.autenticar(user, pass);
  if (u != null) &#123;
    HttpSession session = req.getSession(); // crea si no existe
    session.setAttribute("usuario", u);    // guardar en sesión

    // PRG: redirigir tras POST (o a la URL guardada por el filtro)
    String returnUrl = (String) session.getAttribute("urlRetorno");
    session.removeAttribute("urlRetorno");
    resp.sendRedirect(returnUrl != null ? returnUrl
                                       : req.getContextPath() + "/inicio");
  &#125; else &#123;
    req.setAttribute("errorLogin", "Credenciales incorrectas");
    req.getRequestDispatcher("/vistas/login.jsp").forward(req, resp);
  &#125;
&#125;

// --- CHECK: verificar si hay sesión activa ---
HttpSession session = req.getSession(false); // false = no crear
boolean loggedIn = (session != null && session.getAttribute("usuario") != null);

// --- LOGOUT: destruir la sesión ---
protected void doPost(HttpServletRequest req, HttpServletResponse resp) &#123;
  HttpSession session = req.getSession(false);
  if (session != null) &#123;
    session.invalidate(); // destruye la sesión y todos sus datos
  &#125;
  resp.sendRedirect(req.getContextPath() + "/login");
&#125;
```

**`callout-key`**: "Patrón obligatorio: `getSession(false)` para verificar (no crear sesión vacía). `getSession()` para login (crea si no existe). `invalidate()` en logout."

**`callout-warning`**: "Guardar objetos grandes en sesión penaliza el rendimiento. En entornos con balanceo de carga, los objetos en sesión se serializan y transfieren entre instancias. Solo guardar lo estrictamente necesario."

**Tabla** — "Qué guardar en sesión y qué no" (comparison-table):

| ✓ Adecuado para session           | ✗ Evitar en session                              |
|-----------------------------------|--------------------------------------------------|
| Usuario autenticado (objeto ligero) | Listados completos de datos (van en request)   |
| Carrito de la compra              | Conexiones a BD                                  |
| URL de retorno (temporalmente)    | Objetos no serializables                         |
| Preferencias de idioma/tema       | Resultados de búsqueda paginados                 |

---

## 4. PROHIBICIONES

Iguales al Prompt 1. Especialmente:
- NO modificar las secciones 1–7 ya creadas.
- NO cambiar los stubs `<!-- PENDIENTE:filtros -->` y `<!-- PENDIENTE:utilidades -->` (son para el Prompt 3).
- ERR-001 en todo código nuevo.

---

## 5. AL TERMINAR ESTA SESIÓN

1. El estado en CONTEXT.md sigue siendo 🔄.
2. Ejecutar `npx astro build` y confirmar build limpia.
3. Reportar: secciones completadas, SVGs generados, confirmación ERR-001.

---
---

# PROMPT 3 de 3 — "Filtros + Utilidades"
## Secciones 13–14: Filtros · Utilidades
## + Checklist de cierre completo del bloque

---

## 1. INSTRUCCIONES PREVIAS — leer en este orden exacto

1. `view CONTEXT.md` — verificar estado 🔄 de `servlets-jsp.astro`.
2. `view ERRORS.md` — ERR-001 crítico.
3. `view CONVENTIONS.md` — paleta, componentes.
4. `view SKILLS/SKILL.md` — autoridad de diseño.
5. `view EXAMEN.md` — **el filtro de autenticación es el ejercicio más probable del examen** según el profesor. Leer bien el ejercicio esperado E1.
6. Leer `src/pages/servlets-jsp.astro` completo con `view` para verificar el estado actual.
7. Verificar que los stubs `<!-- PENDIENTE:filtros -->` y `<!-- PENDIENTE:utilidades -->` existen.

---

## 2. ESTADO Y TAREA

- **Esta sesión**: Reemplazar los 2 stubs restantes (filtros y utilidades) con contenido completo.
- **Al terminar**: ejecutar el checklist de cierre completo (CONTEXT.md → ✅, index.astro, historial, build).

---

## 3. CONTENIDO DETALLADO — secciones 13–14

### Sección 13 — `#filtros` · "Filtros"

Reemplazar stub `<!-- PENDIENTE:filtros -->...<!-- /PENDIENTE:filtros -->` con:

**`callout-examen`**: "Peso muy alto. El filtro de autenticación es el ejercicio más probable del examen, mencionado explícitamente por el profesor en la tutoría. Entender doFilter, chain.doFilter, comprobación de sesión, redirect a login y guardado de URL de retorno. Referencia: P5 (AuthFilter), P6."

**Texto introductorio**: Un filtro es un componente que intercepta peticiones (y respuestas) antes de que lleguen a su destino (servlet, JSP o recurso estático). Se pueden encadenar varios filtros. El servlet no sabe que hay filtros actuando sobre él.

**Tabla** — "Casos de uso de filtros" (comparison-table, 5 filas):

| Caso de uso              | Descripción                                                   |
|--------------------------|---------------------------------------------------------------|
| Control de acceso        | Verificar autenticación antes de que la petición llegue al servlet |
| Auditoría                | Registrar tiempo de respuesta, URLs accedidas, usuario        |
| Transformación de respuesta | Comprimir la respuesta (gzip), encriptar                 |
| Encoding global          | Establecer `request.setCharacterEncoding("UTF-8")` en todas las peticiones |
| Métricas                 | Contar peticiones por URL, detectar errores                   |

**SVG 1 — La cadena de filtros** (`viewBox="0 0 760 260"`):  
Dos scenarios superpuestos verticalmente.  
**Scenario 1 (arriba) — petición que pasa**: actores `Cliente`, `Filtro A`, `Filtro B`, `Servlet`. Flujo horizontal: Cliente → Filtro A (pre) → chain.doFilter → Filtro B (pre) → chain.doFilter → Servlet → respuesta → Filtro B (post) → Filtro A (post) → Cliente. Cada filtro tiene una caja con "preproceso" encima de la flecha de entrada y "postproceso" debajo de la flecha de salida.  
**Scenario 2 (abajo) — petición bloqueada**: Cliente → Filtro A (pre) → Filtro A detecta "sin sesión" → NO chain.doFilter → redirect a login. Línea en rojo pálido que marca el bloqueo. Nota: "El Servlet nunca recibe la petición."

**SVG 2 — Flujo del AuthFilter** (`viewBox="0 0 700 320"`):  
Diagrama de flujo (flowchart). Caja inicial: "Petición llega a `/clientes/*`". Rombo de decisión: `session.getAttribute("usuario") != null ?`. Rama SÍ (derecha): "chain.doFilter(req, resp)" → "Petición continúa al servlet". Rama NO (abajo): Tres pasos en secuencia: (1) "Guardar URL destino en sesión: `session.setAttribute('urlRetorno', url)`", (2) "`resp.sendRedirect('/login')`", (3) "`return` (no llamar a chain)". Usar `var(--color-tip-bg)` para la rama de éxito y `var(--color-warning-bg)` para la rama de bloqueo.

**Tabla** — "Interface Filter" (comparison-table, 3 filas):

| Método                                                   | Cuándo se llama             | Uso habitual                              |
|----------------------------------------------------------|-----------------------------|-------------------------------------------|
| `init(FilterConfig config)`                              | Al cargar el filtro (una vez) | Leer parámetros de configuración         |
| `doFilter(ServletRequest, ServletResponse, FilterChain)` | Cada petición que coincida   | Lógica del filtro + chain.doFilter()     |
| `destroy()`                                              | Al destruir el filtro        | Liberar recursos                          |

**`callout-warning`**: "Los parámetros de `doFilter` son `ServletRequest` y `ServletResponse`, NO sus subtipos HTTP. **Hay que hacer casting** a `HttpServletRequest` / `HttpServletResponse` para acceder a `getSession()`, `sendRedirect()`, etc."

**Código** — AuthFilter completo (el ejercicio del examen) (ERR-001 aplicado):

```java
// Filtro de autenticación — patrón de P5
// Protege todas las URLs bajo /clientes/
@WebFilter(urlPatterns = &#123;"/clientes/*"&#125;)
public class AuthFilter implements Filter &#123;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response,
      FilterChain chain) throws IOException, ServletException &#123;

    // PASO 1: Casting a Http* (necesario para acceder a getSession/sendRedirect)
    HttpServletRequest  req  = (HttpServletRequest)  request;
    HttpServletResponse resp = (HttpServletResponse) response;

    // PASO 2: Comprobar si hay usuario autenticado en la sesión
    // getSession(false) → no crear sesión nueva si no existe
    HttpSession session = req.getSession(false);
    boolean autenticado = (session != null)
                       && (session.getAttribute("usuario") != null);

    if (!autenticado) &#123;
      // PASO 3a: Guardar la URL destino para redirigir después del login
      String returnUrl = req.getRequestURI();
      if (req.getQueryString() != null) &#123;
        returnUrl += "?" + req.getQueryString();
      &#125;
      req.getSession().setAttribute("urlRetorno", returnUrl);

      // PASO 3b: Redirigir al formulario de login
      resp.sendRedirect(req.getContextPath() + "/login");
      // IMPORTANTE: return aquí — no llamar a chain.doFilter
      return;
    &#125;

    // PASO 4: Usuario autenticado → continuar la cadena de filtros
    chain.doFilter(request, response);
  &#125;

  @Override public void init(FilterConfig cfg) throws ServletException &#123; &#125;
  @Override public void destroy() &#123; &#125;
&#125;
```

**Código** — configuración alternativa en web.xml (no hay anotación para orden):

```xml
<filter>
  <filter-name>AuthFilter</filter-name>
  <filter-class>es.unirioja.paw.AuthFilter</filter-class>
</filter>
<filter-mapping>
  <filter-name>AuthFilter</filter-name>
  <url-pattern>/clientes/*</url-pattern>
</filter-mapping>
```

Texto: "El orden de ejecución de los filtros está determinado por el orden en `web.xml`. La anotación `@WebFilter` no tiene propiedad de orden — si el orden importa, usar `web.xml`."

**`callout-key`**: "Estructura del AuthFilter: (1) cast a Http*, (2) `getSession(false)` para verificar, (3) si no autenticado → guardar URL + redirect + return, (4) si autenticado → `chain.doFilter()`."

**`callout-relation`**: "Este filtro implementa el mismo patrón que usa Spring Security. En Spring, la configuración es declarativa, pero la lógica subyacente es idéntica: interceptar, verificar sesión, redirigir o continuar."

**Código** — filtro de tiempo de respuesta (ejemplo complementario) (ERR-001 aplicado):

```java
// Filtro de timing: mide cuánto tarda cada petición
@WebFilter("/*")
public class TiempoRespuestaFilter implements Filter &#123;

  public void doFilter(ServletRequest req, ServletResponse resp,
      FilterChain chain) throws IOException, ServletException &#123;
    long inicio = System.currentTimeMillis();

    chain.doFilter(req, resp); // la petición continúa...

    long fin = System.currentTimeMillis();
    HttpServletRequest httpReq = (HttpServletRequest) req;
    // Log: URL + tiempo en ms
    getServletContext().log(
      httpReq.getRequestURI() + " tardó " + (fin - inicio) + " ms"
    );
  &#125;

  // El código DESPUÉS de chain.doFilter es el postprocesado (respuesta ya enviada)
&#125;
```

---

### Sección 14 — `#utilidades` · "Utilidades"

Reemplazar stub `<!-- PENDIENTE:utilidades -->...<!-- /PENDIENTE:utilidades -->` con:

**`callout-examen`**: "Peso medio. La subida de ficheros (multipart) puede entrar en el examen, especialmente la parte HTML del formulario. El profesor lo mencionó en clase. Logging: solo el concepto, no la API concreta."

#### Sub-sección: Subida de ficheros (multipart)

**Texto introductorio**: La subida de ficheros requiere adaptar tanto el formulario HTML como la recepción en el servlet. Se usa el tipo de contenido `multipart/form-data` en lugar del estándar `application/x-www-form-urlencoded`.

**SVG multipart** (`viewBox="0 0 760 220"`):  
Dos paneles. **Panel izquierdo — HTML**: caja "Formulario HTML" con tres atributos resaltados:  
`method="POST"` (en verde pálido),  
`enctype="multipart/form-data"` (en verde más saturado — el más importante),  
`<input type="file" name="foto">` (en azul pálido).  
**Panel derecho — HTTP Request generado**: caja "Petición HTTP" mostrando el formato del cuerpo multipart con líneas:  
`Content-Type: multipart/form-data; boundary=----WebKit...`  
`------WebKit...`  
`Content-Disposition: form-data; name="nombre"`  
`Juan`  
`------WebKit...`  
`Content-Disposition: form-data; name="foto"; filename="perfil.jpg"`  
`Content-Type: image/jpeg`  
`[datos binarios del fichero]`  
Flecha entre los dos paneles con label "El navegador construye automáticamente este formato."

**`callout-key`**: "Tres requisitos para un formulario de subida: `method=\"POST\"` + `enctype=\"multipart/form-data\"` + `<input type=\"file\">`. Si falta `enctype`, el fichero no llega al servidor."

**Tabla** — "Elementos del formulario multipart" (comparison-table, 3 filas):

| Elemento HTML                         | Obligatorio | Por qué                                              |
|---------------------------------------|-------------|------------------------------------------------------|
| `method="POST"`                       | Sí          | GET no puede transportar cuerpos con ficheros        |
| `enctype="multipart/form-data"`       | Sí          | Cambia el Content-Type y el formato del cuerpo HTTP  |
| `<input type="file" name="archivo">`  | Sí          | Control de selección de fichero en el formulario     |

**Código** — HTML del formulario (ERR-001 aplicado):

```html
<form action="$&#123;pageContext.request.contextPath&#125;/subir" method="POST"
      enctype="multipart/form-data">

  <label for="nombre">Nombre:</label>
  <input type="text" id="nombre" name="nombre" required>

  <label for="foto">Foto de perfil:</label>
  <input type="file" id="foto" name="foto" accept="image/*">

  <button type="submit">Subir</button>
</form>
```

**Código** — Servlet receptor con `@MultipartConfig` (ERR-001 aplicado):

```java
@WebServlet("/subir")
@MultipartConfig(
  maxFileSize    = 1024 * 1024 * 5,  // 5 MB por fichero
  maxRequestSize = 1024 * 1024 * 10  // 10 MB por petición
)
public class SubirFotoController extends HttpServlet &#123;

  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException &#123;
    req.setCharacterEncoding("UTF-8");

    // Parámetros de texto: igual que siempre
    String nombre = req.getParameter("nombre");

    // Fichero: via Part API (Servlet 3.0+)
    Part fotoPart = req.getPart("foto");
    String nombreFichero = fotoPart.getSubmittedFileName();
    InputStream contenido = fotoPart.getInputStream();

    // Guardar el fichero (ejemplo: directorio del servidor)
    String rutaDestino = getServletContext().getRealPath("/uploads/") + nombreFichero;
    fotoPart.write(rutaDestino);

    resp.sendRedirect(req.getContextPath() + "/perfil");
  &#125;
&#125;
```

**`callout-warning`**: "`@MultipartConfig` es **obligatorio** en el servlet receptor. Sin él, `req.getPart()` devuelve null aunque el formulario sea correcto."

#### Sub-sección: Logging

**Texto**: En lugar de `System.out.println()`, usar una biblioteca de logging. SLF4j es una fachada (abstracción) que permite cambiar la implementación de logging (LogBack, Log4j, JUL) sin tocar el código. Ventajas: niveles de log (TRACE, DEBUG, INFO, WARN, ERROR), destinos configurables (consola, fichero, BD), gestión automática de tamaño de ficheros.

**Código** — SLF4j básico (ERR-001 aplicado):

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ListadoController extends HttpServlet &#123;
  private static final Logger logger =
    LoggerFactory.getLogger(ListadoController.class);

  protected void doGet(HttpServletRequest req, HttpServletResponse resp) &#123;
    logger.info("Listado solicitado por usuario: &#123;&#125;",
      req.getSession(false) != null
        ? req.getSession(false).getAttribute("usuario")
        : "anónimo");

    logger.debug("Parámetros: página=&#123;&#125;", req.getParameter("pagina"));

    // Si algo falla:
    // logger.error("Error al obtener listado", excepcion);
  &#125;
&#125;
```

**`callout-tip`**: "Usar `&#123;&#125;` como placeholder en SLF4j evita la concatenación de strings cuando el nivel de log está desactivado. `logger.debug(\"valor=\" + obj)` siempre evalúa la concatenación; `logger.debug(\"valor=&#123;&#125;\", obj)` no lo hace si DEBUG está desactivado."

---

## 4. CHECKLIST DE CIERRE COMPLETO (ejecutar en este orden)

### 4.1 Ejecutar `npx astro build`
Confirmar build limpia sin errores. Si hay errores, corregirlos antes de continuar.

### 4.2 Actualizar `CONTEXT.md`

1. Cambiar estado de `servlets-jsp.astro` de 🔄 a ✅ en la tabla de la sección 3.
2. Añadir entrada al historial (sección "Historial de iteraciones") con este formato:

```
### Bloque 4 — Servlets / JSP (2026-XX-XX)
- 14 secciones: motivacion, servlet-estructura, ciclo-vida, request-response,
  jsp-vistas, el-jstl, scopes, patrones-prg, patrones-controlador, patrones-dto,
  cookies, sesion, filtros, utilidades
- X diagramas SVG inline: [listar brevemente]
- X tablas comparison-table: [listar brevemente]
- Callouts: X×callout-examen, X×callout-key, X×callout-warning, X×callout-tip, X×callout-relation
- ERR-001 aplicado en todos los bloques de código
- Build limpia: N páginas en X.XXs
```

### 4.3 Actualizar `src/pages/index.astro`

1. Localizar la card del Bloque 4 — Servlets / JSP.
2. Cambiar la clase del badge de `badge-pending` (o `badge-in-progress`) a `badge-complete`.
3. Cambiar el texto del badge a `Completo`.
4. Verificar que el `href` de la card apunta a `/servlets-jsp` (o la ruta correcta con BASE_URL — ver ERR-002).
5. Si la card tenía `opacity: 0.6` o `pointer-events: none`, eliminarlos.
6. Actualizar la descripción de la card con una frase de máximo 20 palabras que mencione los temas principales. Ejemplo: `Ciclo de vida, MVC, PRG, Front Controller, sesión, filtros de autenticación y subida de ficheros`. Sin punto final. Sin emojis.

### 4.4 Verificar integridad

- Confirmar que ningún bloque ✅ existente fue modificado (fundamentos, jdbc, arquitectura, examen).
- Confirmar que Navbar.astro tiene la entrada para Servlets/JSP si no estaba ya.

### 4.5 Build final

Ejecutar `npx astro build` una vez más para confirmar estado limpio final.

---

## 5. PROHIBICIONES

Iguales a las de Prompts 1 y 2. Especialmente:
- NO modificar secciones 1–12 ya completadas.
- ERR-001 en todo código nuevo.
- NO usar emojis estructurales.

---

## 6. REPORTE FINAL

Al terminar, reportar:
- Build limpia: sí/no + tiempo de build + número de páginas generadas
- Secciones completadas en esta sesión: filtros, utilidades
- SVGs generados: listar brevemente (AuthFilter flowchart, filter chain, multipart)
- ERR-001 confirmado en todos los bloques de código
- CONTEXT.md actualizado: ✅ + historial
- index.astro actualizado: badge `badge-complete` + descripción actualizada
- Siguiente bloque recomendado según tabla de CONTEXT.md
