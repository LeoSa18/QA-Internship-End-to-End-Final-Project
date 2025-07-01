Feature: Add to Cart
    Scenario Outline: User can add an available product to the cart
        Given the user is on a <product> details page
        And the <product> has stock available
        Then the user should see the “Add to Cart” button enabled under the details and quantity input

        Examples:
        | product |
        |'Claw Hammer with Shock Reduction Grip'| 
        |'Bolt Cutters'|        
        |'Claw Hammer'|
        |'Protective Gloves'|