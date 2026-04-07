// frontend/src/components/EcoScoreBadge.jsx
import React from 'react';
import { Badge, Tooltip, Progress } from 'antd';
import { CrownOutlined, EnvironmentOutlined, SmileOutlined, FrownOutlined } from '@ant-design/icons';

const EcoScoreBadge = ({ score, size = 'default' }) => {
  const getScoreLevel = (score) => {
    if (score >= 80) return { color: '#52c41a', icon: <CrownOutlined />, text: 'Excellent' };
    if (score >= 60) return { color: '#73d13d', icon: <EnvironmentOutlined />, text: 'Good' };
    if (score >= 40) return { color: '#faad14', icon: <SmileOutlined />, text: 'Fair' };
    return { color: '#ff4d4f', icon: <FrownOutlined />, text: 'Poor' };
  };

  const level = getScoreLevel(score);
  const badgeSize = size === 'large' ? 48 : 32;

  return (
    <Tooltip title={`Eco Score: ${score} - ${level.text}`}>
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <Progress
          type="circle"
          percent={score}
          width={badgeSize}
          strokeColor={level.color}
          format={() => null}
          strokeWidth={8}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: size === 'large' ? 20 : 14,
            color: level.color,
          }}
        >
          {level.icon}
        </div>
      </div>
    </Tooltip>
  );
};

export default EcoScoreBadge;
