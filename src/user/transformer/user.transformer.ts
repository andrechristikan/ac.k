import { Exclude, Transform } from 'class-transformer';
import { RoleDocumentFull } from 'src/role/role.interface';

export class UserTransformer {
    @Transform(({ value }) => {
        return `${value}`;
    })
    _id: string;

    @Transform(
        ({ value }) => {
            const permissions: string[] = value.permissions.map(
                (val: Record<string, any>) => val.name
            );

            return {
                name: value.name,
                permissions: permissions
            };
        },
        { toPlainOnly: true }
    )
    role: RoleDocumentFull;

    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;

    @Exclude()
    password: string;

    @Exclude()
    __v: string;
}
