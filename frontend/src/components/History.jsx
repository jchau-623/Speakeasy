import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserHistory } from '../store/historyReducer';

const History = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  console.log("user", user); 
  const userId = user ? user._id : null;
  console.log("user id", userId);  
  const history = useSelector((state) => state.history);

  useEffect(() => {
    if (userId) {
      dispatch(getUserHistory(userId));
    }
  }, [dispatch, userId]);

  if (!userId) {
    return <div>Please sign in to view history.</div>;
  }

  if (history.length === 0) {
    return <div>No history found. Ask me anything!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">History</h2>
      <ul className="list-disc pl-5">
        {history.map((item) => (
          <li key={item._id} className="mb-2">
            <h3 className="font-semibold">{item.idiom || item.term}</h3>
            <p>{item.meaning}</p>
            <p><strong>Example:</strong> {item.exampleUse}</p>
            <p><strong>Origin:</strong> {item.origin}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;