const Editor = ({ text, setText, isReadOnly = false }) => {
  return (
    <textarea
      className="w-full p-3 border rounded shadow-sm text-gray-800"
      value={text}
      onChange={(e) => !isReadOnly && setText(e.target.value)}
      readOnly={isReadOnly}
      placeholder="Start typing here..."
      rows={10}
    />
  );
};

export default Editor;
