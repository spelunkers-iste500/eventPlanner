// This file defines a React functional component named `MemberList` which is used to display a list of members in the application.

// The component imports React to use its functionalities for creating the component.

// The `Member` interface defines the shape of a member object, which includes `firstName`, `lastName`, and `email` properties.

// The `MemberListProps` interface defines the shape of the props that the `MemberList` component expects. It includes an array of `Member` objects.

// The `MemberList` component takes a `members` prop and returns a JSX structure that represents the member list. This structure includes:
// - A heading that displays "Members List".
// - An unordered list (`<ul>`) that contains list items (`<li>`) for each member. Each list item displays the member's first name, last name, and email.

// The component uses the `map` function to iterate over the `members` array and create a list item for each member. The `key` prop is set to the index of the member in the array to ensure each list item has a unique key.

// Finally, the `MemberList` component is exported as the default export of the module.

import React from "react";

interface Member {
  firstName: string;
  lastName: string;
  email: string;
}

interface MemberListProps {
  members: Member[];
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  return (
    <div>
      <h2>Members List</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>
            {member.firstName} {member.lastName} - {member.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;