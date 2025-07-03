Feature: Navigate to Registration Page

Scenario: User navigates from Home to Register Page
  Given the user is on the home page
  When the user clicks on the "Register" link in the navigation bar
  And the user clicks on the "Register" button
  Then the user should be redirected to the registration page