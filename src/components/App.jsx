import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './app.module.css';
import { TodoList } from './todoList';
import { TodoPage } from './todoPage';
import { NotFoundPage } from './notFoundPage';

export const App = () => {
	return (
		<Router>
			<div className={styles.app}>
				<Routes>
					<Route path="/" element={<TodoList />} />
					<Route path="/task/:id" element={<TodoPage />} />
					<Route path="/404" element={<NotFoundPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</div>
		</Router>
	);
};
