const Navbar = ({ account }) => {
  return (
    <div className="navbar px-10 bg-primary">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl text-white">
          Energy Management System
        </a>
      </div>
      <div className="flex-none">
        <p className="text-white">Welcome! {account}</p>
      </div>
    </div>
  );
};

export default Navbar;
