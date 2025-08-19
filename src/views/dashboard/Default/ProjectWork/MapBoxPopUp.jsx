const MapBoxPopup = ({ title, content, onClose }) => {
  return (
    <div className="map-popup">
      <div className="popup-header">
        <span>{title}</span>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="popup-body">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
};

export default MapBoxPopup;
