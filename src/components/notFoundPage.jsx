import { Link } from 'react-router-dom';
import styles from './App.module.css';

export const NotFoundPage = () => {
	return (
		<div className={styles.notFoundPage}>
			<div className={styles.notFoundContent}>
				<h1>404</h1>
				<h2>Страница не найдена</h2>
				<p>Извините, запрашиваемая страница не существует.</p>
				<Link to="/" className={styles.homeButton}>
					Вернуться на главную
				</Link>
			</div>
		</div>
	);
};
