const HighlightedText = ({ text, isHtml = false }) => {
  if (isHtml) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return <p>{text}</p>;
};

export default HighlightedText;
