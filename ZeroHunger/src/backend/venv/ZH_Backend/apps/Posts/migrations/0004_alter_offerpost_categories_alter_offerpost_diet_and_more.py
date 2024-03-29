# Generated by Django 4.2 on 2023-08-16 15:48

from django.db import migrations
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('Posts', '0003_alter_offerpost_description_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offerpost',
            name='categories',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('a', 'Fruits'), ('b', 'Vegetables'), ('c', 'Grains'), ('d', 'Dairy'), ('e', 'Dairy alternatives'), ('f', 'Meat / Poultry'), ('g', 'Fish'), ('h', 'Legumes'), ('i', 'Baked goods'), ('j', 'Snacks'), ('k', 'Condiments'), ('l', 'Other')], default='', max_length=23),
        ),
        migrations.AlterField(
            model_name='offerpost',
            name='diet',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('a', 'Halal'), ('b', 'Vegetarian'), ('c', 'Vegan'), ('d', 'Lactose free'), ('e', 'Nut free'), ('f', 'Gluten free'), ('g', 'Sugar free'), ('h', 'Shellfish free'), ('i', 'Other')], default='', max_length=17),
        ),
        migrations.AlterField(
            model_name='offerpost',
            name='logistics',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('a', 'Pick up'), ('b', 'Delivery'), ('c', 'Meet at a public location'), ('d', 'Location must be wheelchair accessible')], default='', max_length=7),
        ),
        migrations.AlterField(
            model_name='requestpost',
            name='categories',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('a', 'Fruits'), ('b', 'Vegetables'), ('c', 'Grains'), ('d', 'Dairy'), ('e', 'Dairy alternatives'), ('f', 'Meat / Poultry'), ('g', 'Fish'), ('h', 'Legumes'), ('i', 'Baked goods'), ('j', 'Snacks'), ('k', 'Condiments'), ('l', 'Other')], default='', max_length=23),
        ),
        migrations.AlterField(
            model_name='requestpost',
            name='diet',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('a', 'Halal'), ('b', 'Vegetarian'), ('c', 'Vegan'), ('d', 'Lactose free'), ('e', 'Nut free'), ('f', 'Gluten free'), ('g', 'Sugar free'), ('h', 'Shellfish free'), ('i', 'Other')], default='', max_length=17),
        ),
        migrations.AlterField(
            model_name='requestpost',
            name='logistics',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('a', 'Pick up'), ('b', 'Delivery'), ('c', 'Meet at a public location'), ('d', 'Location must be wheelchair accessible')], default='', max_length=7),
        ),
    ]
