require 'sinatra'

configure do
	Rack::Mime::MIME_TYPES[".manifest"] = "text/cache-manifest"
end

get '/' do
	redirect '/widget/index.html'
end
