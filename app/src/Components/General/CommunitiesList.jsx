const CommunitiesList = ({ communities }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#66D7D1', '#F7FFF7', '#FFE66D'];

  return (
    <ul className="space-y-1">
      {communities.map((community, index) => (
        <li key={community.name}>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm">{community.name}</span>
            </div>
            <span className="text-sm font-semibold">{community.percentage}%</span>
          </div>
          {index < communities.length - 1 && (
            <div className="border-b border-gray-200"></div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommunitiesList;