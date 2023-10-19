export default (context) => {
  const { resource, route } = context

  return resource({ name: 'health' },
    route({ verb: 'get', to: 'Health#index' })
  )
}