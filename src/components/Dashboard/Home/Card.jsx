import React from 'react';

const Card = ({ color, icon, title, value }) => {
  return (
    <div className={`border ${color} rounded-3xl p-4 flex items-center`}>
      <div className="flex-shrink-0 text-3xl p-2 shadow-xl border my-10 ml-2 rounded-full">
        {icon}
      </div>
      <div className="ml-4 flex-grow">
        <h2 className="text-sm mb-2.5 font-semibold">{title}</h2>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default Card;
