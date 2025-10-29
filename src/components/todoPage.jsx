import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './App.module.css';

const API_URL = 'http://localhost:3001/todos';

export const TodoPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [todo, setTodo] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState('');

	useEffect(() => {
		if (id === undefined) return;

		fetch(`${API_URL}/${id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Задача не найдена');
				}
				return response.json();
			})
			.then((loadedTodo) => {
				if (loadedTodo.title === undefined) {
					navigate('/404');
					return;
				}
				setTodo(loadedTodo);
				setEditedTitle(loadedTodo.title);
			})
			.catch((error) => {
				console.error('Ошибка при загрузке:', error);
				navigate('/404');
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [id, navigate]);

	const handleToggleComplete = () => {
		if (!todo) return;

		fetch(`${API_URL}/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ completed: !todo.completed }),
		})
			.then((response) => response.json()) // ← ДОБАВЬТЕ ЭТУ СТРОКУ
			.then((updatedTodo) => {
				setTodo(updatedTodo);
			})
			.catch((error) => {
				console.error('Ошибка при обновлении:', error);
			});
	};

	const handleSaveEdit = () => {
		if (!editedTitle.trim()) return;

		fetch(`${API_URL}/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: editedTitle.trim() }),
		})
			.then((response) => response.json()) // ← ДОБАВЬТЕ ЭТУ СТРОКУ
			.then((updatedTodo) => {
				setTodo(updatedTodo);
				setIsEditing(false);
			})
			.catch((error) => {
				console.error('Ошибка при обновлении:', error);
			});
	};

	const handleDeleteTodo = () => {
		fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				navigate('/');
			})
			.catch((error) => {
				console.error('Ошибка при удалении:', error);
			});
	};

	const handleBack = () => {
		navigate(-1);
	};

	if (isLoading) {
		return <div className={styles.loader}>Загрузка...</div>;
	}

	if (!todo) {
		return null;
	}

	return (
		<div className={styles.todoPage}>
			<div className={styles.todoPageHeader}>
				<button onClick={handleBack} className={styles.backButton}>
					← Назад
				</button>
				<h1>Страница задачи</h1>
			</div>

			<div className={styles.todoPageContent}>
				<div className={styles.todoPageItem}>
					<div className={styles.todoPageCheckbox}>
						<input
							type="checkbox"
							checked={todo.completed}
							onChange={handleToggleComplete}
							className={styles.checkbox}
						/>
						<span>Задача выполнена</span>
					</div>

					<div className={styles.todoPageContent}>
						{isEditing ? (
							<div className={styles.editForm}>
								<textarea
									value={editedTitle}
									onChange={(e) => setEditedTitle(e.target.value)}
									className={styles.editTextarea}
									rows="4"
								/>
								<div className={styles.editButtons}>
									<button
										onClick={handleSaveEdit}
										className={styles.saveButton}
										disabled={!editedTitle.trim()}
									>
										Сохранить
									</button>
									<button
										onClick={() => {
											setIsEditing(false);
											setEditedTitle(todo.title);
										}}
										className={styles.cancelButton}
									>
										Отмена
									</button>
								</div>
							</div>
						) : (
							<>
								<h2 className={todo.completed ? styles.completed : ''}>
									{todo.title}
								</h2>
								<button
									onClick={() => setIsEditing(true)}
									className={styles.editButton}
								>
									Редактировать
								</button>
							</>
						)}
					</div>

					<div className={styles.todoPageMeta}>
						<p className={styles.todoId}>ID: {todo.id}</p>
						<div className={todo.completed ? styles.statusCompleted : styles.statusPending}>
							{todo.completed ? 'Выполнено' : 'В процессе'}
						</div>
					</div>

					<div className={styles.todoPageActions}>
						<button
							onClick={handleDeleteTodo}
							className={styles.deleteButton}
						>
							Удалить задачу
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
