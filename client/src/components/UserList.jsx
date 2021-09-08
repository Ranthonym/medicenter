import React, { useState, useEffect } from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { List } from "stream-chat-react/dist/components/AutoCompleteTextarea/List";

import { InviteIcon } from "../assets";

//helper functions

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = ({ user }) => {
  return (
    <div className="user-item__wrapper">
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.fullName || user.id} size={32} />
        <p className="user-item__name">{user.fullName || user.id}</p>
      </div>
    </div>
  );
};

const UserList = () => {
  const { client } = useChatContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const response = await client.queryUsers(
          // filter out current user from list
          { id: { $ne: client.userID } },
          { id: 1 },
          { limit: 8 }
        );
        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    if (client) getUsers();
  }, []);

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__message">Loading users...</div>
      ) : (
        users?.map((user, index) => (
          <UserItem index={index} key={user.id} user={user} />
        ))
      )}
    </ListContainer>
  );
};

export default UserList;
