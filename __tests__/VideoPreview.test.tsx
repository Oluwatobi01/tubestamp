import { render, screen } from '@testing-library/react';
import VideoPreview from '@/components/VideoPreview';

describe('VideoPreview', () => {
  it('shows placeholder text when no details and not loading', () => {
    render(<VideoPreview loading={false} details={null} timestamps={[]} />);
    expect(screen.getByText(/Your video details and generated timestamps will appear here/i)).toBeInTheDocument();
  });
});
