import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }

interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(error: Error, info: unknown) { console.error(error, info); }

  render() {
    if (this.state.hasError) return <div className="p-6">Something went wrong.</div>;
    return this.props.children;
  }
}
