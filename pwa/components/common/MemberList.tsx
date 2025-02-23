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