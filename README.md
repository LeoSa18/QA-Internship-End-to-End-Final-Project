# 🧪 Practice Software Testing - Final Project

Este proyecto fue desarrollado como parte del desafío final del Internship de QA en Endava. Simula un entorno real de testing sobre una aplicación e-commerce, incluyendo pruebas manuales, automatización de UI y API, y reportes de resultados.

## 🔗 Enlaces Útiles

- **Jira Board**: [INTTP002 Board](https://jira.endava.com/secure/RapidBoard.jspa?rapidView=6859&projectKey=INTTP002)
- **Sitio Web a Testear**: [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/)
- **API Docs (Swagger UI)**: [Swagger Docs](https://practicesoftwaretesting.com/swagger)
- **Backend Repo**: [practice-software-testing GitHub](https://github.com/testsmith-io/practice-software-testing/tree/main/sprint5)

## 📁 Estructura del Proyecto
/manual-tests # Casos de prueba en formato Gherkin 

/tests/pages # Contiene las Páginas del POM 

## 🚀 Cómo Ejecutar los Tests

### ▶️ Tests de UI
npx playwright test

## 📊 Generar Reporte Allure
npx allure generate ./allure-results --clean -o ./allure-report

npx allure open ./allure-report

## 📝 Autores
- Leonardo Saracho
- Avril Perrone
- Lucía Feiguin
