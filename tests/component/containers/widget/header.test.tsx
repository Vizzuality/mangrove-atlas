import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WidgetHeader from '@/containers/widget/header';

describe('WidgetHeader collapse control', () => {
  it('exposes the collapse control as a button inside the heading', () => {
    render(
      <WidgetHeader id="mangrove_habitat_extent" title="Habitat extent" isCollapsed={false} />
    );

    const button = screen.getByRole('button', { name: 'Habitat extent' });
    expect(button.closest('h2')).not.toBeNull();
  });

  it('reports expanded state and points at the content it controls', () => {
    const { rerender } = render(
      <WidgetHeader id="mangrove_habitat_extent" title="Habitat extent" isCollapsed={false} />
    );

    const button = screen.getByRole('button', { name: 'Habitat extent' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', 'widget-mangrove_habitat_extent-content');

    rerender(
      <WidgetHeader id="mangrove_habitat_extent" title="Habitat extent" isCollapsed={true} />
    );
    expect(screen.getByRole('button', { name: 'Habitat extent' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('toggles from the keyboard', async () => {
    const user = userEvent.setup();
    render(<WidgetHeader id="mangrove_habitat_extent" title="Habitat extent" />);

    const button = screen.getByRole('button', { name: 'Habitat extent' });
    expect(button).toHaveAttribute('aria-expanded', 'true');

    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
