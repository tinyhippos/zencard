#  ApplicationBase
#
#  Some basic methods, including FileIO, logging, exception handling
module Helpers

    # Copy all contents from orig dir to target dir
    def copy_full_dir(orig, target)
        FileUtils.cp_r(orig, target)
    end

    # Delete dir and all contents
    def delete_full_dir(directory)
        FileUtils.rm_r(directory)
    end

    # Delete dir and all contents
    def delete_full_dir_contents(directory)
        FileUtils.rm_r(Dir.glob("#{directory}*"))
    end

    # Save lines (String) to a file_to_write (String) (overwrites)
    def save(lines, file_to_write)
        # write to file (write only, erases file and starts over) "a" starts at end, creates a new one if does not exist
        File.open(file_to_write, "w") do |aFile|
          
            aFile.syswrite lines

        end
    end

    # Appends lines (String) to a file_to_write (String)
    def append(lines, file_to_append)
        # append to file, "a" starts at end, creates a new one if does not exist
        File.open(file_to_append, "w") do |aFile|
          
            aFile.syswrite lines

        end
    end

    # Read in a file.
    #
    # Arguments
    #   * full_path :: file location
    #
    # A block is provided to deal with each line at a time, else the whole buffer is returned as (String) regardless.
    #
    #   self.read_in_file(SOME_FILEPATH) do |line|
    #
    #     "// #{line}"
    #   
    #   end
    def read_in_file(full_path, &block)

        data = String.new

        if !File.directory?(full_path)
            IO.foreach full_path do |line|

                if block_given?
                    data += yield(line)
                else
                    data += line
                end

            end
        end

        data

    end

end