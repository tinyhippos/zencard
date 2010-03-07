
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


      end

    rescue Exception => e  
      self.handle_exception(e)
    end


    end

    protected

    # parses command line options and does its thang
    def parsed_options?

        opts = OptionParser.new

        opts.on('-h', '--help')                         { self.output_help  }
        opts.on('-V', '--verbose')                      { @options.verbose = true }  
        opts.on('-q', '--quiet')                        { @options.quiet = true }
        opts.on('-c', '--compress')                        { @options.compress = true }

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

    def compress_fragments(output_method=@output_methods.code, fragments)

        frag_length = fragments.length

        fragments.each_with_index do |item, index|
            self.log("#{index+1}/#{frag_length}") if @options.verbose
            fragments[index] = item.replace(self.compress(output_method, @compilation_levels.simpleoptimizations, item))
        end

    end

end
