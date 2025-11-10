import { render, screen } from '@testing-library/react';
import HeroForm from '@/components/HeroForm';

describe('HeroForm', () => {
  it('renders submit button', () => {
    render(<HeroForm onSubmit={() => {}} loading={false} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
