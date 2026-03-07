import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page page--centered">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/dashboard">Go to dashboard</Link>
    </div>
  );
}

export default NotFoundPage;