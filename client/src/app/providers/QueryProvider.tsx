type QueryProviderProps = {
  children: React.ReactNode;
};

function QueryProvider({ children }: QueryProviderProps) {
  return <>{children}</>;
}

export default QueryProvider;