Feature: Registration with existing email

  Scenario Outline: Registration attempt with an email that already exists
    Given the user is on the home page
    When the user navigates to the registration page
    And the user submits the registration form with the following data:
      | firstName    | <firstName>    |
      | lastName     | <lastName>     |
      | dateOfBirth  | <dateOfBirth>  |
      | street       | <streetAddress>|
      | postalCode   | <postalCode>   |
      | city         | <city>         |
      | state        | <state>        |
      | country      | <country>      |
      | phone        | <phone>        |
      | email        | <email>        |
      | password     | <password>     |
    Then an error message for existing email should be displayed
    And the user should remain on the registration page

    Examples:
      | firstName | lastName | dateOfBirth | streetAddress | postalCode | city      | state | country                          | phone      | email                           | password        |
      | John      | Doe      | 10/11/2003  | 123 Main St   | 12345      | Anytown   | CA    | United States of America (the)   | 1234567890 | customer@practicesoftwaretesting.com | Passwo4rd123!   |
      | Alice     | Smith    | 21/05/1978  | 456 Oak Ave   | 54321      | Metropolis| NY    | United States of America (the)   | 9876543210 | customer3@practicesoftwaretesting.com | MyPa8ssw0rd!    |