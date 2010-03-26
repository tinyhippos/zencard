
class Builder

    include Compressor
    include Helpers

    MAIN_CONFIG_FILE = 'conf/build.conf'
    
    # Initiates Object, set class vars and option defaults
    #
    # Arguments
    #   * argv :: system ARGV
    #   * stdin :: system STDIN
    def initialize(args, stdin)

        @config = ParseConfig.new(MAIN_CONFIG_FILE)

        @stdin = stdin
        @argv = args

		@lib_src = ""

        # Set defaults
        @options = OpenStruct.new
        @options.verbose = false
        @options.quiet = false
        @options.compress = false

        @compilation_levels = OpenStruct.new
        @compilation_levels.simpleoptimizations = "SIMPLE_OPTIMIZATIONS"
        
        @output_methods = OpenStruct.new
        @output_methods.error = "errors"
        @output_methods.code = "compiled_code"
        @output_methods.warning = "warnings"
        @output_methods.statistic = "statistics"

    end

    # Does the actual building of all the JS code
    def build

		begin

			if self.parsed_options?

				self.log("--> Beginning Build...\n") if @options.verbose

				#FileUtils.mkdir self.config("APPLICATION_LIB_DIRECTORY") if !File.directory? self.config("APPLICATION_LIB_DIRECTORY")

				#self.continue?("--> Creating build directory...\n") do
					#FileUtils.mkdir self.config("BUILD_DIRECTORY") if !File.directory? self.config("BUILD_DIRECTORY")
				#end

				#self.continue?("--> Clearing the build directory...\n") do
					#self.delete_full_dir_contents(self.config("BUILD_DIRECTORY"))
				#end
				
				self.continue?("--> Reading in library src...\n") do
					self.collect_files([self.config("APPLICATION_LIB_SOURCE_DIRECTORY")], @lib_src)
				end

				if @options.compress
					self.continue?("--> Compressing javascript files...\n") do
						self.compress_fragments(@output_methods.code, [@lib_src])
					end
				end

				self.continue?("--> Saving library src...\n") do
					self.save(self.author_stamp + @lib_src, self.config("APPLICATION_LIB_FILE"))
				end

				self.log("**Finished** :-)")

			end

		rescue Exception => e  
			self.handle_exception(e)
		end

    end

    protected

    def collect_files(directory_array, obj)
        directory_array.each do |directory|
            Dir.foreach directory do |file_name|
                obj << self.read_in_file(directory+file_name) + "\n"
            end
        end
        obj.gsub!(/@/,"")
    end

	def config(param)
		@config.params[param]
	end

    # parses command line options and does its thang
    def parsed_options?

        opts = OptionParser.new

        opts.on('-h', '--help')         { self.output_help(self.config("HELP"))  }
        opts.on('-V', '--verbose')      { @options.verbose = true }  
        opts.on('-q', '--quiet')        { @options.quiet = true }
        opts.on('-c', '--compress')     { @options.compress = true }
        opts.on('-l', '--license')      { self.log(self.read_in_file(self.config("LICENSE"))) ; exit!(0) }

        begin
            opts.parse!(@argv)
        rescue Exception => e  
            self.handle_exception(e)
            exit!(0)
        end

        self.process_options

        true

    end

    # Performs post-parse processing on options
    def process_options

        begin

            @options.verbose = false if @options.quiet
            @options.verbose = true if @options.inspection

        rescue Exception => e  
            self.handle_exception(e)
        end    

    end

    # compress each of the file fragments

    def compress_fragments(output_method, fragments)

		output_method = @output_methods.code if !output_method
		
        frag_length = fragments.length

        fragments.each_with_index do |item, index|
            self.log("#{index+1}/#{frag_length}") if @options.verbose
            fragments[index] = item.replace(self.compress(output_method, @compilation_levels.simpleoptimizations, item))
        end

    end

    def author_stamp
        stamp = "/* \n  " + self.config("APPNAME") + " :: Built On #{Time.now}\n\n" +
            (self.read_in_file(self.config("LICENSE")) do |line|
                "  #{line}"
            end) + 
            "*/\n"

        stamp
    end

end
