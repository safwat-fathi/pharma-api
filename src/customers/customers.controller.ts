import { Controller, Get } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './schemas/customer.schema';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    // This is a placeholder. In a real app, you'd have pagination and filtering.
    // @ts-ignore
    return this.customersService.findAll();
  }
}
