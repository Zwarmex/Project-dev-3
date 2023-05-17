import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddRecipePage from '../pages/addrecipepage/AddRecipePage';
import { UserContext } from '../components';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate,
}));

const mockContext = { idUser: '123' };

describe('AddRecipePage', () => {
	test('handleAddRecipe function test', () => {
		render(
			<UserContext.Provider value={mockContext}>
				<AddRecipePage />
			</UserContext.Provider>
		);
	});
	test('renders without crashing', () => {
		render(
			<UserContext.Provider value={mockContext}>
				<AddRecipePage />
			</UserContext.Provider>
		);
		expect(screen.getByText(/Ajoute une recette/i)).toBeInTheDocument();
	});

	test('title input updates value', () => {
		render(
			<UserContext.Provider value={mockContext}>
				<AddRecipePage />
			</UserContext.Provider>
		);
		const titleInput = screen.getByLabelText(/Titre/i);
		userEvent.type(titleInput, 'Test Recipe');
		expect(titleInput).toHaveValue('Test Recipe');
	});
});
