# Flashcards de Vocabulario

Una aplicación de flashcards para aprender vocabulario en inglés y español, diseñada para funcionar en GitHub Pages. Carga diferentes conjuntos de vocabulario por URL sin necesidad de servidor.

## Características

- **Aplicación estática**: Funciona completamente en GitHub Pages sin servidor
- **Carga dinámica de vocabulario**: Carga vocabulario desde archivos JSON en la carpeta `month/`
- **Parámetros de URL**: Especifica qué archivo de vocabulario cargar usando el parámetro `month`
- **Modos de estudio**: Inglés → Español y Español → Inglés
- **Interfaz moderna**: Diseño responsive con Tailwind CSS
- **Seguimiento de progreso**: Contador de respuestas correctas e incorrectas

## Uso

### GitHub Pages

La aplicación está diseñada para funcionar directamente en GitHub Pages. Simplemente abre `index.html` en tu navegador o despliega en GitHub Pages.

### Parámetros de URL

- **Sin parámetros**: Carga todo el vocabulario de todos los archivos
  ```
  https://tu-usuario.github.io/tu-repositorio/
  ```

- **Archivo específico**: Carga solo el vocabulario del archivo especificado
  ```
  https://tu-usuario.github.io/tu-repositorio/?month=octubre
  https://tu-usuario.github.io/tu-repositorio/?month=noviembre
  ```

### Estructura de archivos

```
/
├── index.html              # Aplicación principal
├── vocabulario-octubre.js  # Componente React
├── month/                 # Carpeta con archivos de vocabulario
│   ├── index.json         # Índice de archivos disponibles
│   ├── octubre.json       # Vocabulario de octubre
│   └── noviembre.json     # Vocabulario de noviembre
└── README.md              # Este archivo
```

### Formato de archivos de vocabulario

Los archivos JSON deben seguir este formato:

```json
[
  {
    "english": "Palabra en inglés",
    "spanish": "Palabra en español", 
    "category": "Categoría"
  }
]
```

## Agregar nuevo vocabulario

1. Crea un nuevo archivo JSON en la carpeta `month/`
2. Sigue el formato especificado arriba
3. Actualiza el archivo `month/index.json` para incluir el nuevo archivo
4. El archivo estará disponible automáticamente usando `?month=nombreDelArchivo`

### Ejemplo de actualización del índice

```json
{
  "files": ["octubre", "noviembre", "diciembre"]
}
```

## Tecnologías utilizadas

- React 18
- Tailwind CSS
- Babel Standalone (para transpilación en el navegador)
- GitHub Pages (hosting estático)
