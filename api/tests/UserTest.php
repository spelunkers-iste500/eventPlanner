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
    /* public function testCreateUser(): void
     {
         $startTime = microtime(true);
         $response = static::createClient()->request('POST', '/users', [
             'headers' => ['Content-Type' => 'application/ld+json'],
             'json' => [
                 'name' => 'Ritchie',
                 'email' => 'ritchie@rit.edu',
                 'emailVerified' => '2025-01-28T18:01:00+00:00',
                 'image' => 'https://www.rit.edu/blog/sites/rit.edu.blog/files/styles/blog_author_600_x_600_focused_/public/images/blog-author/Screen%20Shot%202021-03-24%20at%209.45.15%20AM.png?h=687e6f5a&itok=V2F-hH8I',
                 'lastModified' => '2025-01-28T18:01:00+00:00',
                 'createdDate' => '2025-01-28T18:01:00+00:00',
             ]
         ]);
         $endTime = microtime(true);
         $this->assertResponseStatusCodeSame(201);
         $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
         $this->assertJsonContains([
             '@context' => '/contexts/User',
             '@type' => 'User',
             'name' => 'Ritchie',
             'email' => 'ritchie@rit.edu',
             'emailVerified' => '2025-01-28T18:01:00+00:00',
             'image' => 'https://www.rit.edu/blog/sites/rit.edu.blog/files/styles/blog_author_600_x_600_focused_/public/images/blog-author/Screen%20Shot%202021-03-24%20at%209.45.15%20AM.png?h=687e6f5a&itok=V2F-hH8I',
             'lastModified' => '2025-01-28T18:01:00+00:00',
             'createdDate' => '2025-01-28T18:01:00+00:00',
         ]);
         $this->assertMatchesResourceItemJsonSchema(User::class);      
         $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
         $executionTime = round($executionTime, 3); // Round to 3 decimal places
         echo "Create User execution time: " . $executionTime . " milliseconds\n";
     }*/

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
         $endTime = microtime(true);
         $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
         $executionTime = round($executionTime, 3); // Round to 3 decimal places
         echo "Update User execution time: " . $executionTime . " milliseconds\n";
     }
     //test to see if only an admin can delete a user
    /* public function testDeleteUser(): void
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
        $client->request('DELETE', $user3Iri,['auth_bearer' =>$jwttokenUser1['token']] );
        $endTime = microtime(true);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            // Through the container, you can access all your services from the tests, including the ORM, the mailer, remote API clients...
            static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'ritchie@rit.edu'])
        );
        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $executionTime = round($executionTime, 3); // Round to 3 decimal places
        echo "Delete User execution time: " . $executionTime . " milliseconds\n";
     }*/
 }