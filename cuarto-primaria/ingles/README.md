# Flashcards de Vocabulario

Una aplicación de flashcards para aprender vocabulario en inglés y español, diseñada para funcionar en GitHub Pages. Carga diferentes conjuntos de vocabulario por URL sin necesidad de servidor.

## Características

- **Aplicación estática**: Funciona completamente en GitHub Pages sin servidor
- **Carga dinámica desde Google Sheets**: Carga vocabulario directamente desde Google Sheets usando OpenSheet API
- **Filtros interactivos**: Desplegables para seleccionar mes y categoría específicos
- **Parámetros de URL**: Especifica qué mes cargar usando el parámetro `month`
- **Modos de estudio**: Inglés → Español y Español → Inglés
- **Interfaz moderna**: Diseño responsive con Tailwind CSS
- **Seguimiento de progreso**: Contador de respuestas correctas e incorrectas

## Uso

### GitHub Pages

La aplicación está diseñada para funcionar directamente en GitHub Pages. Simplemente abre `index.html` en tu navegador o despliega en GitHub Pages.

### Parámetros de URL

- **Sin parámetros**: Carga todo el vocabulario de todos los meses
  ```
  https://tu-usuario.github.io/tu-repositorio/
  ```

- **Mes específico**: Carga solo el vocabulario del mes especificado
  ```
  https://tu-usuario.github.io/tu-repositorio/?month=octubre
  https://tu-usuario.github.io/tu-repositorio/?month=noviembre
  https://tu-usuario.github.io/tu-repositorio/?month=diciembre
  https://tu-usuario.github.io/tu-repositorio/?month=enero
  https://tu-usuario.github.io/tu-repositorio/?month=febrero
  https://tu-usuario.github.io/tu-repositorio/?month=marzo
  https://tu-usuario.github.io/tu-repositorio/?month=abril
  https://tu-usuario.github.io/tu-repositorio/?month=mayo
  https://tu-usuario.github.io/tu-repositorio/?month=junio
  ```

### Filtros Interactivos

La aplicación incluye desplegables para filtrar el contenido:

- **Selector de Mes**: Permite elegir entre todos los meses del curso académico (Octubre a Junio) o "Todos los meses"
  - Al cambiar el mes, se actualiza automáticamente la URL
  - El mes de la URL aparece seleccionado por defecto al cargar la página
- **Selector de Categoría**: 
  - Si no hay mes seleccionado: muestra todas las categorías de todos los meses
  - Si hay mes seleccionado: muestra solo las categorías de ese mes específico

### Estructura de archivos

```
/
├── index.html              # Aplicación principal
├── vocabulario-octubre.js  # Componente React
└── README.md              # Este archivo
```

### Fuente de datos

La aplicación carga el vocabulario directamente desde Google Sheets usando la API de OpenSheet:

- **URL base**: `https://opensheet.elk.sh/1mvPzno2fQuo9E37Pbwfq0bhrd6s5iLm85EO2zCgqnoc/`
- **Formato de datos**: JSON con estructura `[{"english": "...", "spanish": "...", "category": "..."}]`
- **Categorías**: Formato `"Categoría - Día Mes"` (ej: "Escuela - 7 Octubre")

## Agregar nuevo vocabulario

Para agregar nuevo vocabulario, simplemente añade nuevas hojas en tu Google Sheet con el nombre del mes correspondiente. La aplicación detectará automáticamente los nuevos meses disponibles.

### Formato de datos en Google Sheets

Las columnas deben ser:
- **english**: Palabra en inglés
- **spanish**: Palabra en español  
- **category**: Categoría en formato "Nombre - Día Mes" (ej: "Escuela - 7 Octubre")

### Ejemplo de estructura en Google Sheets

| english | spanish | category |
|---------|---------|----------|
| school | escuela | Escuela - 7 Octubre |
| teacher | maestro/a | Escuela - 7 Octubre |
| Be – was/were – been | ser/estar | Verbos - 21 Octubre |

## Tecnologías utilizadas

- React 18
- Tailwind CSS
- Babel Standalone (para transpilación en el navegador)
- GitHub Pages (hosting estático)
