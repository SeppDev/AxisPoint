class SigmaController < InertiaController
  skip_before_action :authenticate
  before_action :perform_authentication
  def index
  end

  def create
  end
end
