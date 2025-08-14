# Clinical Decision Support Tool – DOAC Recommendation

This project is a browser-based clinical decision support system (CDSS) designed to calculate the CHA₂DS₂-VASc score for atrial fibrillation patients and recommend appropriate anticoagulant therapy (e.g., DOACs such as Apixaban and Rivaroxaban) based on patient-specific criteria.

The tool is built with Vite.js and the source code is located in the `app` directory.

## Live Site

The application is deployed using GitHub Pages and is available at:

[https://sebuo.github.io/anticoagulation-CDSS/](https://sebuo.github.io/anticoagulation-CDSS/)

## Development

To run the application locally, you need to have Node.js and npm installed.

1.  Navigate to the `app` directory:
    ```bash
    cd app
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Building for Production

To build the application for production, run the following command from the `app` directory:

```bash
npm run build
```

The build output will be placed in the `docs` directory in the root of the project, which is configured for GitHub Pages deployment.

## Styling

This project uses SCSS for styling. The SCSS files are compiled to CSS. It is recommended to have `sass` installed. You can install it globally via npm:

```bash
npm install -g sass
```

Vite will handle the compilation of `app/style.scss` to `app/style.css` during development and build processes, but having the `sass` package available is a good practice.
