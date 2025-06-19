    Scenario: Navigate to the registration form from the homepage
        Given the user is on the Hompage
        When the user clicks on the "Sign In" button
        And clicks on the "Register your account" button
        Then the registration form should be displayed