Feature: User Registration

  Scenario Outline: Register a user with valid data
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
    Then the user should be redirected to the login page

    Examples:
      | firstName | lastName | dateOfBirth | streetAddress | postalCode | city      | state | country                          | phone      | email                     | password        |
      | John      | Doe      | 10/11/2003  | 123 Main St   | 12345      | Anytown   | CA    | United States of America (the) | 1234567890 | john14.doe@example.com    | Passwo4rd123!   |
      | Alice     | Smith    | 21/05/1978  | 456 Oak Ave   | 54321      | Metropolis| NY    | United States of America (the) | 9876543210 | alice11.s@example.com      | MyPa8ssw0rd!     |
      | Carlos    | Rivera   | 24/06/2003  | 789 Pine Rd   | 67890      | Miami     | FL    | United States of America (the) | 1122334455 | carlos63.r@example.com    | Sec!ure123*     |
