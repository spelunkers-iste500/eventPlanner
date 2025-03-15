<?php
// api/tests/usertest.php
namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
 class UserTest extends ApiTestCase
 {
     // This trait provided by Foundry will take care of refreshing the database content to a known state before each test
     use ResetDatabase, Factories;
     protected function setUp(): void
     {
         parent::setUp();
         self::ensureKernelShutdown();
         self::bootKernel();
     }
     public function createUser(string $email, string $plainPassword, bool $superAdmin): User {
        $container = self::getContainer();
        $user = UserFactory::createOne(['email' => $email, 'superAdmin' => $superAdmin]);
        $hashedPassword = $container->get('security.user_password_hasher')->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
        $user->_save(); // Save the user after setting the password
        return $user;
    }
    public function authenticateUser(string $email, string $password): array {
        $authclient = self::createClient();
        $authresponse = $authclient->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => $email,
                'password' => $password,
            ],
        ]);
        return $authresponse->toArray();
    }
    public function calculateExecutionTime(float $startTime, string $echoPhrase): string {
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        return $echoPhrase . " execution time: " . $executionTime . " milliseconds\n";
    }
     public function testCreateUser(): void
     {
         $startTime = microtime(true);
         $response = static::createClient()->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                'email' => 'ratchie@rit.edu', 
                'superAdmin' => false, 
                'firstName' => 'Ratchie',
                'lastName' => 'The Tiger',
                'phoneNumber' => '+15854755000',
                'gender' => 'm',
                'title' => 'mr',
                'plainPassword' => 'spleunkers123',
                'birthday' => '2000-01-01T00:00:00+00:00'
             ]
         ]);
         $this->assertResponseStatusCodeSame(201);
         $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
         $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@type' => 'User',
            'email' => 'ratchie@rit.edu', 
            'name' => 'Ratchie The Tiger',
            'birthday' => '2000-01-01T00:00:00+00:00',
            'gender' => 'm',
            'title' => 'mr',
            'phoneNumber' => '+15854755000',
            'superAdmin' => false
         ]);
         $this->assertMatchesResourceItemJsonSchema(User::class);      
        $executionMessage = $this->calculateExecutionTime($startTime, "Create User");
        echo $executionMessage;
     }
    //function to test get user permissions
    public function testPermissionGetUser(): void
    {
        $startTime = microtime(true);
        //create users
        $container = self::getContainer();
        //user user factory instead of function because i need specific fields
        $user = UserFactory::createOne([
            'email' => 'ratchie@rit.edu', 
            'superAdmin' => false, 
            'firstName' => 'Ratchie',
            'lastName' => 'The Tiger',
            'phoneNumber' => '585-555-5555',
            'gender' => 'M',
            'birthday' => new \DateTime('2000-01-01T00:00:00+00:00')
            ]);
        $hashedPassword = $container->get('security.user_password_hasher')->hashPassword($user, 'spleunkers123');
        $user->setPassword($hashedPassword);
        $user->_save(); // Save the user after setting the password

        //create 2nd user for deny testing
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $user1Iri = $this->findIriBy(User::class, ['id' => $user->getId()]);
        $user2Iri = $this->findIriBy(User::class, ['id' => $user2->getId()]);
        
        // Use the get method to get info on user
        $client->request('GET', $user1Iri, ['auth_bearer' => $jwttoken['token']]);
       
        //verify user is good
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $user1Iri,
            'email' => 'ratchie@rit.edu',
            'name' => 'Ratchie The Tiger',
            'birthday' => '2000-01-01T00:00:00+00:00',
            'gender' => 'M',
            'phoneNumber' => '585-555-5555'
        ]);
        //test to see if user can't patch another user
        $client->request('GET', $user2Iri, ['auth_bearer' => $jwttoken['token']]);
        $this->assertResponseStatusCodeSame(403);
        //end time calculation
        $executionMessage = $this->calculateExecutionTime($startTime, "Get User");
        echo $executionMessage;
    }
     //function to test if a user can patch themselves and not others
     public function testPermissionUpdateUser(): void
     {
        $startTime = microtime(true);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', false);
        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false);
        // Authenticate the user
        $jwttoken = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');

         $client = static::createClient();
         // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
         $user1Iri = $this->findIriBy(User::class, ['id' => $user->getId()]);
         $user2Iri = $this->findIriBy(User::class, ['id' => $user2->getId()]);
         
         // Use the PATCH method here to do a partial update on current user
         $client->request('PATCH', $user1Iri, [
             'json' => [
                 'firstName' => 'Ratchie',
                 'lastName' => 'The Tiger'
             ],
             'headers' => [
                 'Content-Type' => 'application/merge-patch+json',
             ],
             'auth_bearer' => $jwttoken['token']
         ]);
        
         //verify user is good
         $this->assertResponseIsSuccessful();
         $this->assertJsonContains([
             '@id' => $user1Iri,
             'email' => 'ratchie@rit.edu',
             'firstName' => 'Ratchie',
             'lastName' => 'The Tiger'
         ]);
         //test to see if user can't patch another user
         $client->request('PATCH', $user2Iri, [
            'json' => [
                'firstName' => 'Ratchie',
                'lastName' => 'The Tiger'
            ],
            'headers' => [
                'Content-Type' => 'application/merge-patch+json',
            ],
            'auth_bearer' => $jwttoken['token']
        ]);
         $this->assertResponseStatusCodeSame(403);
         //end time calculation
         $executionMessage = $this->calculateExecutionTime($startTime, "Update User");
         echo $executionMessage;
     }
     //test to see if only an admin can delete a user
     public function testDeleteUser(): void
     {
        $startTime = microtime(true);
        //create users
        $user = $this->createUser('ratchie@rit.edu', 'spleunkers123', true);

        $user2 = $this->createUser('ritchie@rit.edu', 'spleunkers123', false);
        $user3 = $this->createUser('casey@rit.edu', 'spleunkers123', false);
        // Authenticate the user
        $jwttokenUser1 = $this->authenticateUser('ratchie@rit.edu', 'spleunkers123');
        $jwttokenUser2 = $this->authenticateUser('ritchie@rit.edu', 'spleunkers123');

        $client = static::createClient();
        // findIriBy allows to retrieve the IRI of an item by searching for some of its properties.
        $user3Iri = $this->findIriBy(User::class, ['id' => $user3->getId()]);
        // Only create the user we need with a given email
        $client = static::createClient();
        //fail test to ensure no other user can delete except super admin
        $client->request('DELETE', $user3Iri,['auth_bearer' =>$jwttokenUser2['token']] );
        $this->assertResponseStatusCodeSame(403);
        
        //delete user if superadmin test
       // $client->request('DELETE', $user3Iri,['auth_bearer' =>$jwttokenUser1['token']] );
        $endTime = microtime(true);
        //$this->assertResponseStatusCodeSame(204);
        //$this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
          //  static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'ritchie@rit.edu'])
        //);
        //end time calculation
        $executionMessage = $this->calculateExecutionTime($startTime, "Delete User");
        echo $executionMessage;
     }
 }