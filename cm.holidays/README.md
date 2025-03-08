# cm.holidays
Allow person in the company to ask for a holiday that the company allow. Furthermore, to the responsible to validate this or refuse.

# Errors documentation

  1. **COMMONS**

     - HOLIDAY-4004 : entity not found
     - HOLIDAY-4000 : Bad request
     - HOLIDAY-4009 : Conflicts
     - HOLIDAY-4001 : Unauthorized
     - HOLIDAY-4022 : cannot proceed to this operation
     - HOLIDAY-5001 : failed operation
     - HOLIDAY-3009 : name is required
     - HOLIDAY-3010 : name must be more than one character
     - HOLIDAY-3011 : description is required
     - HOLIDAY-3012 : description must be more than nine (9) characters
     - HOLIDAY-3029 : already in the state
     
  2. **EMPLOYEE**

     - HOLIDAY-3000 : firstName is required
     - HOLIDAY-3001 : firstName must be more than one character
     - HOLIDAY-3002 : email is required
     - HOLIDAY-3003 : email has the wrong format
     - HOLIDAY-3004 : password is required
     - HOLIDAY-3005 : password must have at least 6 character and less than 11
     - HOLIDAY-3006 : password must have at least one uppercase, lowercase, digit and special character
     - HOLIDAY-3007 : lastname is required
     - HOLIDAY-3008 : lastname must be more than one character
     - HOLIDAY-3034 : lastname already exist
     - HOLIDAY-3035 : email already exist
     - HOLIDAY-3041 : passwords are the same
     - HOLIDAY-3042 : wrong password provide

  3. **ROLES**

     - HOLIDAY-3013 : roles are required
     - HOLIDAY-3014 : roles must be an array
     - HOLIDAY-3033 : roles not found
  
  4. **SERVICE**

     - HOLIDAY-3015 : service are required
     - HOLIDAY-3016 : malformed request (service type is missing)
     - HOLIDAY-3030 : service not found
     - HOLIDAY-3032 : service is not active
     - HOLIDAY-3043 : another service already exist with the same name
     - HOLIDAY-3044 : service is active and nay be used

  5. **POST**

     - HOLIDAY-3017 : posts are required
     - HOLIDAY-3018 : posts must be an array
     - HOLIDAY-3031 : already not exist
     - HOLIDAY-3036 : posts are not active

  6. **HOLIDAY_TYPE**

     - HOLIDAY-3037 : not found
     - HOLIDAY-3040 : holiday type already exist

  7. **HOLIDAY_REQUEST**

     - HOLIDAY-3019 : Malformed request (Holiday type is missing)
     - HOLIDAY-3020 : The starting date field is required
     - HOLIDAY-3021 : The starting date must be a date
     - HOLIDAY-3022 : The starting date must be higher than the actual date
     - HOLIDAY-3023 : The ending date field is required
     - HOLIDAY-3024 : The ending date field must be a date
     - HOLIDAY-3025 : The ending date must be higher than the starting date
     - HOLIDAY-3026 : The returning date is required
     - HOLIDAY-3027 : The returning date must be a date
     - HOLIDAY-3028 : The returning date must be higher than the ending date
     - HOLIDAY-3038 : There is another holiday with the same starting date
     - HOLIDAY-3039 : holiday request not found


# Limitations for now (0.0.1) but will be manage to the next version

 - Cannot create role
 - cannot update role
 - cannot activate or deactivate role
 - The Roles presents are statics
 - Edit user profile

# TODO (0.0.2)
 - Get all information ('role', holiday request, services, posts, employees) according to the user role
 - Edit (EmployeeController, Holiday, Service, Post) information
 - user `express-jwt-permission` to manage permission as well as role (already installed)
 - Cannot activate a post without activating the service before
 - use auto mapper [Automappers](https://automapperts.netlify.app/)
 - Use `class-validator` and `class-transformer` for validation
 - Use `Injection Dependency` ad `Inversion of Control`
 - Use `DDD(Doman Driven Design)` [DDD](https://khalilstemmler.com/articles/typescript-value-object/)
 - Use `ValueObject` [valueObject](https://khalilstemmler.com/articles/typescript-value-object/)
 - Use `DTO` in deep [DTO](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/use-dtos-to-enforce-a-layer-of-indirection/)
 - General link there [khalilstemmler](https://khalilstemmler.com/articles/categories/enterprise-node-type-script)
 - Make the holiday requests and user pagination 
