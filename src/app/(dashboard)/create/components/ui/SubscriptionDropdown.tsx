import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const SubscriptionDropdown = ({ subscriptions, field, form }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                        )}
                    >
                        {field.value
                            ? subscriptions.find(
                                  (subscription) => subscription.value === field.value
                              )?.label
                            : 'Select subscription'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No subscription found.</CommandEmpty>
                        <CommandGroup>
                            {subscriptions.map((subscription) => (
                                <CommandItem
                                    value={subscription.label}
                                    key={subscription.value}
                                    onSelect={() => {
                                        form.setValue('subscription', subscription.value);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            subscription.value === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {subscription.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default SubscriptionDropdown;
