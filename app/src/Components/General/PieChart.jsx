import React, { useContext } from 'react';
import UserContext from '../../Context/UserContext';

const PieChart = ({ total }) => {
  const { recipientPreference } = useContext(UserContext);
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#66D7D1', '#ACFFAC', '#FFE66D'];
  let startAngle = 0;

  const svgSize = 200;
  const radius = 80;
  const strokeWidth = 10;

  return (
    <div className="relative w-48 h-48 mx-auto mb-4">
      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full h-full">
        {recipientPreference.map((recipient, index) => {
          // console.log(recipient)
          const angle = (recipient.percentage / 100) * 360;
          const endAngle = startAngle + angle;
          
          const x1 = svgSize / 2 + radius * Math.cos((Math.PI * startAngle) / 180);
          const y1 = svgSize / 2 + radius * Math.sin((Math.PI * startAngle) / 180);
          const x2 = svgSize / 2 + radius * Math.cos((Math.PI * endAngle) / 180);
          const y2 = svgSize / 2 + radius * Math.sin((Math.PI * endAngle) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
          ].join(' ');

          startAngle = endAngle;

          return (
            <path
              key={recipient.recipient_name}
              d={pathData}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold">
          ${typeof total === 'number' ? total.toFixed(2) : '0.00'}
        </span>
        <span className="text-sm">This Week</span>
      </div>
    </div>
  );
};

export default PieChart;