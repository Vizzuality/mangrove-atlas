module Response
  def json_response(object, status = :ok, meta = {})
    render json: object,
      status: status,
      adapter: :json,
      root: 'data',
      meta: meta
  end
end