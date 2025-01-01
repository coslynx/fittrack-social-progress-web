import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Button from '../src/components/common/Button';
import Input from '../src/components/common/Input';
import Modal from '../src/components/common/Modal';
import AuthForms from '../src/components/features/auth/AuthForms';
import DashboardStats from '../src/components/features/dashboard/DashboardStats';
import GoalItem from '../src/components/features/goals/GoalItem';
import GoalForm from '../src/components/features/goals/GoalForm';
import { AuthProvider } from '../src/context/AuthContext';
import useAuth from '../src/hooks/useAuth';
import useFetch from '../src/hooks/useFetch';
import { request } from '../src/services/api';
import axios from 'axios';


jest.mock('../src/services/api', () => ({
    request: jest.fn(),
}));
jest.mock('axios');
jest.mock('../src/hooks/useFetch', () => jest.fn());


describe('Button Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the button with the provided text', () => {
        render(<Button onClick={() => {}}>Test Button</Button>);
        expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('should call onClick handler when clicked', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Click Me</Button>);
        fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
        expect(onClick).toHaveBeenCalled();
    });

    it('should not throw an error if onClick is null or undefined', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });
     it('should not render if children is not passed', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<Button onClick={jest.fn()} />);
         expect(screen.queryByRole('button')).not.toBeInTheDocument();
         expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
     });
});


describe('Input Component', () => {
     afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render input with the given type, value and placeholder', () => {
        render(<Input type="text" value="test value" onChange={() => {}} placeholder="Test Placeholder" />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
        expect(screen.getByRole('textbox')).toHaveValue('test value');
        expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Test Placeholder');
    });
   it('should call onChange with the sanitized value when input changes', () => {
        const onChange = jest.fn();
        render(<Input type="text" value="" onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '<script>evil</script>test' } });
        expect(onChange).toHaveBeenCalledWith('test');
    });
    it('should not render input component with invalid type', () => {
       const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<Input type="invalid" value="test" onChange={jest.fn()}/>);
         expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
         expect(consoleErrorSpy).toHaveBeenCalled();
         consoleErrorSpy.mockRestore();
    });
     it('should not render input component when value is not a string', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<Input type="text" value={123} onChange={jest.fn()}/>);
         expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();
         consoleErrorSpy.mockRestore();
    });
    it('should not render input component when onChange is not a function', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
         render(<Input type="text" value="test" onChange="invalid"/>);
         expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});


describe('Modal Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the modal when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={() => {}}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });
     it('should not render the modal when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={() => {}}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
     });
      it('should call onClose when overlay is clicked', () => {
        const onCloseMock = jest.fn();
        render(
            <Modal isOpen={true} onClose={onCloseMock}>
                <div>Modal Content</div>
            </Modal>
        );
          fireEvent.mouseDown(screen.getByRole('dialog').firstChild);
         expect(onCloseMock).toHaveBeenCalled();
    });
     it('should call onClose when escape key is pressed', () => {
        const onCloseMock = jest.fn();
         render(
            <Modal isOpen={true} onClose={onCloseMock}>
                 <div>Modal Content</div>
            </Modal>
        );
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape', charCode: 27 });
        expect(onCloseMock).toHaveBeenCalled();
    });
     it('should not render the modal if isOpen is not a boolean', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<Modal isOpen="true" onClose={() => {}}><div>Modal Content</div></Modal>);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();
         consoleErrorSpy.mockRestore();
    });
      it('should not render the modal if onClose is not a function', () => {
         const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<Modal isOpen={true} onClose="invalid"><div>Modal Content</div></Modal>);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
         expect(consoleErrorSpy).toHaveBeenCalled();
          consoleErrorSpy.mockRestore();
    });
    it('should not render the modal if children is not provided', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<Modal isOpen={true} onClose={() => {}} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();
         consoleErrorSpy.mockRestore();
    });
     it('should focus the first focusable element when modal is open', () => {
          render(
             <Modal isOpen={true} onClose={() => {}}>
                <button>First Focusable</button>
                <input type="text" />
              </Modal>
        );
        expect(screen.getByRole('button')).toHaveFocus();
    });
});


describe('AuthForms Component', () => {
     afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render login form elements', () => {
        render(
            <AuthProvider>
              <AuthForms />
            </AuthProvider>
        );
        expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Password' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Switch to Signup' })).toBeInTheDocument();
    });

    it('should toggle between login and signup forms', () => {
           render(
                <AuthProvider>
                  <AuthForms />
                </AuthProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Switch to Signup' }));
         expect(screen.getByRole('button', { name: 'Signup' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Switch to Login' })).toBeInTheDocument();
    });

    it('should handle form input changes', async () => {
        render(
             <AuthProvider>
                  <AuthForms />
                </AuthProvider>
        );
        fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByRole('textbox', { name: 'Password' }), { target: { value: 'password123' } });
        expect(screen.getByRole('textbox', { name: 'Username' })).toHaveValue('testuser');
        expect(screen.getByRole('textbox', { name: 'Password' })).toHaveValue('password123');
    });


    it('should call login on form submission', async () => {
        const loginMock = jest.fn();
         useAuth.mockReturnValue({
            login: loginMock,
            loading: false,
            error: null,
            isAuthenticated: false,
        });
         render(
            <AuthProvider>
                <AuthForms />
            </AuthProvider>
        );
         fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByRole('textbox', { name: 'Password' }), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

         await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
        });
    });
     it('should prevent default form submission', async () => {
        const loginMock = jest.fn();
        useAuth.mockReturnValue({
            login: loginMock,
            loading: false,
            error: null,
            isAuthenticated: false,
        });
       const submitHandler = jest.fn();
         render(
            <AuthProvider>
                  <AuthForms onSubmit={submitHandler} />
                </AuthProvider>
        );

        fireEvent.submit(screen.getByRole('form'));
        await waitFor(() => {
             expect(submitHandler).not.toHaveBeenCalled();
        });

    });
});



describe('DashboardStats Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render loading state', () => {
         useAuth.mockReturnValue({
             fetchWithAuth: jest.fn(),
        });
        render(
             <AuthProvider>
                <DashboardStats />
            </AuthProvider>
        );
       expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    it('should render error state', async () => {
         useAuth.mockReturnValue({
             fetchWithAuth: jest.fn().mockRejectedValue({ message: 'API error' }),
        });

        render(
             <AuthProvider>
                <DashboardStats />
            </AuthProvider>
        );
        await waitFor(() => {
           expect(screen.getByText('Error: API error')).toBeInTheDocument();
        });

    });
    it('should render no data message if stats is null', async () => {
       useAuth.mockReturnValue({
          fetchWithAuth: jest.fn().mockResolvedValue({
              status: 200,
              data: null,
        }),
        });
          render(
            <AuthProvider>
               <DashboardStats />
            </AuthProvider>
        );
        await waitFor(() => {
            expect(screen.getByText('No stats available')).toBeInTheDocument();
       });

    });
      it('should fetch and display user stats', async () => {
        const mockStatsData = {
            totalWorkouts: 10,
            totalCaloriesBurned: 500,
            averageWorkoutDuration: 45,
            totalDistanceCovered: 10,
            lastWorkout: new Date().toISOString(),
        };
          useAuth.mockReturnValue({
                fetchWithAuth: jest.fn().mockResolvedValue({
                  status: 200,
                    data: mockStatsData,
                }),
           });
        render(
            <AuthProvider>
               <DashboardStats />
            </AuthProvider>
        );

          await waitFor(() => {
            expect(screen.getByText(/Total Workouts: 10/)).toBeInTheDocument();
            expect(screen.getByText(/Total Calories Burned: 500/)).toBeInTheDocument();
            expect(screen.getByText(/Average Workout Duration: 45 minutes/)).toBeInTheDocument();
             expect(screen.getByText(/Total Distance Covered: 10 km/)).toBeInTheDocument();
        });

    });
    it('should sanitize and render workout data', async () => {
         const mockStatsData = {
            totalWorkouts: '<script>evil</script>10',
            totalCaloriesBurned: '<script>evil</script>500',
            averageWorkoutDuration: '<script>evil</script>45',
            totalDistanceCovered: '<script>evil</script>10',
           lastWorkout: new Date().toISOString(),
       };

      useAuth.mockReturnValue({
                fetchWithAuth: jest.fn().mockResolvedValue({
                  status: 200,
                    data: mockStatsData,
                }),
           });

          render(
            <AuthProvider>
               <DashboardStats />
            </AuthProvider>
        );
         await waitFor(() => {
            expect(screen.getByText(/Total Workouts: 10/)).toBeInTheDocument();
            expect(screen.getByText(/Total Calories Burned: 500/)).toBeInTheDocument();
             expect(screen.getByText(/Average Workout Duration: 45 minutes/)).toBeInTheDocument();
            expect(screen.getByText(/Total Distance Covered: 10 km/)).toBeInTheDocument();
       });
    });
      it('should handle api errors', async () => {
        const errorMessage = 'Failed to fetch statistics';
       useAuth.mockReturnValue({
            fetchWithAuth: jest.fn().mockRejectedValue({ message: errorMessage }),
         });
        render(
           <AuthProvider>
               <DashboardStats />
            </AuthProvider>
        );
         await waitFor(() => {
            expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
        });

     });
});


describe('GoalItem Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render goal details', () => {
        const goal = {
            id: '1',
            name: 'Run 5k',
            description: 'Run a 5k race',
            target: 5,
            unit: 'km',
             progress: 2,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
        };
        render(<GoalItem goal={goal} />);
         expect(screen.getByText(/Run 5k/)).toBeInTheDocument();
        expect(screen.getByText(/Run a 5k race/)).toBeInTheDocument();
        expect(screen.getByText(/Target: 5 km/)).toBeInTheDocument();
        expect(screen.getByText(/Progress: 2/)).toBeInTheDocument();
         expect(screen.getByText(/Start Date:/)).toBeInTheDocument();
        expect(screen.getByText(/End Date:/)).toBeInTheDocument();
    });
   it('should render goal details with no description', () => {
        const goal = {
           id: '1',
           name: 'Run 5k',
           target: 5,
            unit: 'km',
             progress: 2,
           startDate: new Date().toISOString(),
           endDate: new Date().toISOString(),
        };
         render(<GoalItem goal={goal} />);
         expect(screen.getByText(/Run 5k/)).toBeInTheDocument();
         expect(screen.getByText(/No description/)).toBeInTheDocument();
         expect(screen.getByText(/Target: 5 km/)).toBeInTheDocument();
        expect(screen.getByText(/Progress: 2/)).toBeInTheDocument();
          expect(screen.getByText(/Start Date:/)).toBeInTheDocument();
        expect(screen.getByText(/End Date:/)).toBeInTheDocument();

    });
      it('should sanitize the data', () => {
        const goal = {
           id: '1',
           name: '<script>evil</script>Run 5k',
           description: '<script>evil</script>Run a 5k race',
          target: 5,
            unit: '<script>evil</script>km',
             progress: '<script>evil</script>2',
           startDate: new Date().toISOString(),
           endDate: new Date().toISOString(),
        };
       render(<GoalItem goal={goal} />);
         expect(screen.getByText(/Run 5k/)).toBeInTheDocument();
          expect(screen.getByText(/Run a 5k race/)).toBeInTheDocument();
         expect(screen.getByText(/Target: 5 km/)).toBeInTheDocument();
          expect(screen.getByText(/Progress: 2/)).toBeInTheDocument();
        expect(screen.getByText(/Start Date:/)).toBeInTheDocument();
        expect(screen.getByText(/End Date:/)).toBeInTheDocument();
     });
     it('should not render the component if the goal prop is not valid', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<GoalItem goal="invalid"/>);
        expect(screen.queryByRole('goalItem')).not.toBeInTheDocument();
          expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
     it('should not render the component when the goal object is null', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
          render(<GoalItem goal={null}/>);
        expect(screen.queryByRole('goalItem')).not.toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();
         consoleErrorSpy.mockRestore();
    });
});


describe('GoalForm Component', () => {
      afterEach(() => {
          jest.clearAllMocks();
    });
   it('should render goal form fields', () => {
        render(
              <AuthProvider>
                 <GoalForm />
              </AuthProvider>
        );
         expect(screen.getByRole('textbox', { name: 'Goal Name' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Target' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Unit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Goal' })).toBeInTheDocument();
   });
    it('should handle form input changes', async () => {
        render(
             <AuthProvider>
                  <GoalForm />
               </AuthProvider>
        );
         fireEvent.change(screen.getByRole('textbox', { name: 'Goal Name' }), { target: { value: 'Test Goal' } });
        fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), { target: { value: 'Test Description' } });
         fireEvent.change(screen.getByRole('textbox', { name: 'Target' }), { target: { value: '10' } });
       fireEvent.change(screen.getByRole('textbox', { name: 'Unit' }), { target: { value: 'km' } });
        expect(screen.getByRole('textbox', { name: 'Goal Name' })).toHaveValue('Test Goal');
        expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue('Test Description');
         expect(screen.getByRole('textbox', { name: 'Target' })).toHaveValue('10');
         expect(screen.getByRole('textbox', { name: 'Unit' })).toHaveValue('km');
    });
     it('should call fetchWithAuth on form submission', async () => {
           const fetchWithAuthMock = jest.fn().mockResolvedValue({ status: 201 });
         useAuth.mockReturnValue({
              fetchWithAuth: fetchWithAuthMock,
          });
         render(
               <AuthProvider>
                 <GoalForm />
               </AuthProvider>
        );
          fireEvent.change(screen.getByRole('textbox', { name: 'Goal Name' }), { target: { value: 'Test Goal' } });
         fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByRole('textbox', { name: 'Target' }), { target: { value: '10' } });
        fireEvent.change(screen.getByRole('textbox', { name: 'Unit' }), { target: { value: 'km' } });
          fireEvent.click(screen.getByRole('button', { name: 'Create Goal' }));
         await waitFor(() => {
          expect(fetchWithAuthMock).toHaveBeenCalledWith('/api/user/goals', 'POST', { name: 'Test Goal', description: 'Test Description', target: '10', unit: 'km' });
        });
    });
    it('should reset the form after successful submission', async () => {
        const fetchWithAuthMock = jest.fn().mockResolvedValue({ status: 201 });
           useAuth.mockReturnValue({
               fetchWithAuth: fetchWithAuthMock,
           });
        render(
            <AuthProvider>
                <GoalForm />
            </AuthProvider>
        );
        fireEvent.change(screen.getByRole('textbox', { name: 'Goal Name' }), { target: { value: 'Test Goal' } });
        fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByRole('textbox', { name: 'Target' }), { target: { value: '10' } });
          fireEvent.change(screen.getByRole('textbox', { name: 'Unit' }), { target: { value: 'km' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create Goal' }));

           await waitFor(() => {
              expect(screen.getByRole('textbox', { name: 'Goal Name' })).toHaveValue('');
            expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue('');
              expect(screen.getByRole('textbox', { name: 'Target' })).toHaveValue('');
            expect(screen.getByRole('textbox', { name: 'Unit' })).toHaveValue('');
           });
    });
    it('should handle api errors', async () => {
         const fetchWithAuthMock = jest.fn().mockRejectedValue({ message: 'API error' });
       useAuth.mockReturnValue({
           fetchWithAuth: fetchWithAuthMock,
        });
         render(
              <AuthProvider>
                <GoalForm />
              </AuthProvider>
        );

        fireEvent.change(screen.getByRole('textbox', { name: 'Goal Name' }), { target: { value: 'Test Goal' } });
         fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), { target: { value: 'Test Description' } });
       fireEvent.change(screen.getByRole('textbox', { name: 'Target' }), { target: { value: '10' } });
       fireEvent.change(screen.getByRole('textbox', { name: 'Unit' }), { target: { value: 'km' } });
       fireEvent.click(screen.getByRole('button', { name: 'Create Goal' }));
        await waitFor(() => {
           expect(fetchWithAuthMock).toHaveBeenCalled();
        });
   });
});