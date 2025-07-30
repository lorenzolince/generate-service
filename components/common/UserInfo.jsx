import Image from "next/image";

const UserInfo = ({ exprireToken, nameUser, image }) => {
  return (
    <div className="user-info">
      <label className="header-label-Exprire">Expire session =</label>
      <label className="header-label-text">{exprireToken}</label>
      <label className="header-color-text">Welcome {nameUser}</label>
      
      <div className="user-avatar">
        <Image
          src={image}
          alt="Avatar"
          width={40}
          height={40}
          className="user-avatar-img"
        />
      </div>
    </div>
  );
};

export default UserInfo;